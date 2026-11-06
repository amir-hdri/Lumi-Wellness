from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth import get_current_user, require_roles
from app.database import get_db
from app.models import Branch, Membership, MembershipPlan, Notification, TrainingProgram, User
from app.responses import error_response, paginated_response, success_response
from app.schemas import MembershipCreate, MembershipRenew, MembershipResponse, MembershipUpdate

router = APIRouter(prefix="/api/v1/memberships", tags=["Memberships"])


@router.get("")
def list_memberships(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    user_id: str = None,
    plan_id: str = None,
    branch_id: str = None,
    status: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Athletes can only see their own memberships
    if current_user.role == "athlete":
        user_id = user_id or current_user.id
        if user_id != current_user.id:
            return error_response("Insufficient permissions", 403)
    query = db.query(Membership)
    if current_user.role == "coach":
        query = query.filter(Membership.user_id.in_(db.query(TrainingProgram.athlete_id).filter(TrainingProgram.coach_id == current_user.id)))
    if user_id:
        query = query.filter(Membership.user_id == user_id)
    if plan_id:
        query = query.filter(Membership.plan_id == plan_id)
    if branch_id:
        query = query.filter(Membership.branch_id == branch_id)
    if status:
        query = query.filter(Membership.status == status)
    total = query.count()
    memberships = query.offset((page - 1) * page_size).limit(page_size).all()
    data = []
    for m in memberships:
        data.append(MembershipResponse.model_validate(m).model_dump(by_alias=True))
    return paginated_response(data=data, total=total, page=page, page_size=page_size)


@router.post("")
def create_membership(
    req: MembershipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "receptionist", "coach")),
):
    # Coaches may only enrol their own athletes (same TrainingProgram-based
    # definition the list endpoint uses) — previously a coach-created athlete
    # was stuck with no membership until an admin stepped in.
    if current_user.role == "coach":
        coached = (
            db.query(TrainingProgram.id)
            .filter(
                TrainingProgram.coach_id == current_user.id,
                TrainingProgram.athlete_id == req.user_id,
            )
            .first()
        )
        if not coached:
            return error_response("Coaches can only create memberships for their own athletes", 403)
    for model, reference in ((User, req.user_id), (MembershipPlan, req.plan_id), (Branch, req.branch_id)):
        if not db.query(model).filter(model.id == reference).first():
            return error_response(f"{model.__name__} not found", 404)
    if req.end_date <= req.start_date or req.sessions_used > req.sessions_total:
        return error_response("Invalid membership dates or session balance", 400)
    has_term = db.query(Membership.id).filter(Membership.user_id == req.user_id).first() is not None
    if has_term and current_user.role != "admin":
        return error_response("Management approval is required for an additional membership term", 403)
    membership = Membership(**req.model_dump(by_alias=False))
    if has_term:
        membership.renewal_approved_at = datetime.now(timezone.utc).replace(tzinfo=None)
        membership.renewal_approved_by = current_user.id
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return success_response(
        data=MembershipResponse.model_validate(membership).model_dump(by_alias=True),
        message="Membership created",
    )


@router.get("/{membership_id}")
def get_membership(membership_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    membership = db.query(Membership).filter(Membership.id == membership_id).first()
    if not membership:
        return error_response("Membership not found", 404)
    if current_user.role == "coach" and not db.query(TrainingProgram).filter(TrainingProgram.athlete_id == membership.user_id, TrainingProgram.coach_id == current_user.id).first():
        return error_response("Insufficient permissions", 403)
    if current_user.role == "athlete" and membership.user_id != current_user.id:
        return error_response("Insufficient permissions", 403)
    d = MembershipResponse.model_validate(membership).model_dump(by_alias=True)
    return success_response(data=d)


@router.put("/{membership_id}")
def update_membership(
    membership_id: str,
    req: MembershipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "receptionist")),
):
    membership = db.query(Membership).filter(Membership.id == membership_id).first()
    if not membership:
        return error_response("Membership not found", 404)
    update_data = req.model_dump(exclude_unset=True, by_alias=False)
    used = update_data.get("sessions_used", membership.sessions_used)
    total = update_data.get("sessions_total", membership.sessions_total)
    start = update_data.get("start_date", membership.start_date)
    end = update_data.get("end_date", membership.end_date)
    if start and start.tzinfo:
        start = start.astimezone(timezone.utc).replace(tzinfo=None)
        update_data["start_date"] = start
    if end and end.tzinfo:
        end = end.astimezone(timezone.utc).replace(tzinfo=None)
        update_data["end_date"] = end
    if used is None or total is None or used > total or start is None or end is None or end <= start:
        return error_response("Invalid membership dates or session balance", 400)
    price = update_data.get("price", membership.price)
    discount = update_data.get("discount_amount", membership.discount_amount)
    if price is None or discount is None or discount >= price:
        return error_response("Invalid membership price or discount", 400)
    final_price = price - discount
    supplied_final = update_data.get("final_price", final_price)
    if supplied_final is None or abs(supplied_final - final_price) > 0.01:
        return error_response("final_price must equal price minus discount_amount", 400)
    if any(field in update_data for field in ("price", "discount_amount", "final_price")):
        update_data["final_price"] = final_price
    grants_benefit = (
        end > membership.end_date or total > membership.sessions_total or used < membership.sessions_used
        or start < membership.start_date or final_price < membership.final_price
        or (membership.status in {"expired", "cancelled"} and update_data.get("status") == "active")
    )
    if grants_benefit and current_user.role != "admin":
        return error_response("Management approval is required to extend membership benefits", 403)
    for key, value in update_data.items():
        setattr(membership, key, value)
    if grants_benefit:
        membership.renewal_approved_at = datetime.now(timezone.utc).replace(tzinfo=None)
        membership.renewal_approved_by = current_user.id
    db.commit()
    db.refresh(membership)
    d = MembershipResponse.model_validate(membership).model_dump(by_alias=True)
    return success_response(data=d, message="Membership updated")


@router.post("/{membership_id}/freeze")
def freeze_membership(
    membership_id: str,
    req: MembershipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "receptionist")),
):
    membership = db.query(Membership).filter(Membership.id == membership_id).first()
    if not membership:
        return error_response("Membership not found", 404)
    if membership.status != "active":
        return error_response("Only active memberships can be frozen", 400)
    membership.status = "frozen"
    membership.freeze_reason = req.freeze_reason
    membership.freeze_end_date = req.freeze_end_date
    db.commit()
    db.refresh(membership)
    return success_response(
        data=MembershipResponse.model_validate(membership).model_dump(by_alias=True),
        message="Membership frozen",
    )


@router.post("/{membership_id}/renew")
def renew_membership(
    membership_id: str,
    req: MembershipRenew,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    """Management approves the new term; athletes only request a renewal."""
    membership = db.query(Membership).filter(Membership.id == membership_id).first()
    if not membership:
        return error_response("Membership not found", 404)
    end = req.end_date
    if end <= max(membership.start_date, membership.end_date, datetime.now(timezone.utc).replace(tzinfo=None)):
        return error_response("New end date must extend the term and be in the future", 400)
    total = req.sessions_total if req.sessions_total is not None else membership.sessions_total
    if not req.reset_sessions_used and total < membership.sessions_used:
        return error_response("Session balance cannot be negative", 400)
    membership.end_date = end
    membership.status = "active"
    membership.freeze_reason = None
    membership.freeze_end_date = None
    if req.sessions_total is not None:
        membership.sessions_total = req.sessions_total
    if req.reset_sessions_used:
        membership.sessions_used = 0
    membership.renewal_approved_at = datetime.now(timezone.utc).replace(tzinfo=None)
    membership.renewal_approved_by = current_user.id
    db.commit()
    db.refresh(membership)
    return success_response(
        data=MembershipResponse.model_validate(membership).model_dump(by_alias=True),
        message="Membership renewed",
    )


@router.post("/{membership_id}/renewal-request")
def request_membership_renewal(
    membership_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("athlete")),
):
    membership = db.query(Membership).filter(Membership.id == membership_id).first()
    if not membership:
        return error_response("Membership not found", 404)
    if membership.user_id != current_user.id:
        return error_response("Insufficient permissions", 403)
    pending = membership.renewal_requested_at and (
        not membership.renewal_approved_at or membership.renewal_requested_at > membership.renewal_approved_at
    )
    if not pending:
        admins = db.query(User).filter(User.role == "admin", User.status == "active").all()
        if not admins:
            return error_response("No manager is available to review the renewal", 503)
        membership.renewal_requested_at = datetime.now(timezone.utc).replace(tzinfo=None)
        for admin in admins:
            db.add(Notification(
                user_id=admin.id, title="درخواست تمدید عضویت",
                message=f"{current_user.first_name} {current_user.last_name} درخواست تمدید عضویت دارد.",
                type="info", action_url=f"/admin/members/{current_user.id}",
            ))
        db.commit()
        db.refresh(membership)
    return success_response(
        data=MembershipResponse.model_validate(membership).model_dump(by_alias=True),
        message="Renewal requested; waiting for management approval",
    )


@router.post("/{membership_id}/unfreeze")
def unfreeze_membership(
    membership_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "receptionist")),
):
    membership = db.query(Membership).filter(Membership.id == membership_id).first()
    if not membership:
        return error_response("Membership not found", 404)
    if membership.status != "frozen":
        return error_response("Membership is not frozen", 400)
    membership.status = "active"
    membership.freeze_reason = None
    membership.freeze_end_date = None
    db.commit()
    db.refresh(membership)
    return success_response(
        data=MembershipResponse.model_validate(membership).model_dump(by_alias=True),
        message="Membership unfrozen",
    )


@router.post("/{membership_id}/deduct")
@router.post("/{membership_id}/deduct-session")
def deduct_session(
    membership_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "receptionist", "coach")),
):
    membership = db.query(Membership).filter(Membership.id == membership_id).first()
    if not membership:
        return error_response("Membership not found", 404)
    if current_user.role == "coach" and not db.query(TrainingProgram).filter(TrainingProgram.athlete_id == membership.user_id, TrainingProgram.coach_id == current_user.id).first():
        return error_response("Insufficient permissions", 403)
    if membership.status != "active":
        return error_response("Membership is not active", 400)
    if membership.sessions_used >= membership.sessions_total:
        return error_response("No remaining sessions", 400)
    membership.sessions_used += 1
    db.commit()
    db.refresh(membership)
    d = MembershipResponse.model_validate(membership).model_dump(by_alias=True)
    return success_response(data=d, message="Session deducted")
