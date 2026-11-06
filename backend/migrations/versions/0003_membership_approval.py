"""Track membership renewal requests and management approvals."""
from alembic import op
import sqlalchemy as sa

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("memberships", sa.Column("renewal_requested_at", sa.DateTime(), nullable=True))
    op.add_column("memberships", sa.Column("renewal_approved_at", sa.DateTime(), nullable=True))
    op.add_column("memberships", sa.Column("renewal_approved_by", sa.String(), nullable=True))


def downgrade():
    with op.batch_alter_table("memberships") as batch:
        batch.drop_column("renewal_approved_by")
        batch.drop_column("renewal_approved_at")
        batch.drop_column("renewal_requested_at")
