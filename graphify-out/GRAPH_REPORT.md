# Graph Report - Lumi-Wellness  (2026-11-06)

## Corpus Check
- 393 files · ~244,922 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: (none) 7, .woff2 4, .ttf 3)

## Summary
- 3231 nodes · 9300 edges · 190 communities (137 shown, 53 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 406 edges (avg confidence: 0.94)
- Token cost: unavailable; agent token usage was not exposed. Compatibility zeros are not measured consumption.

## Graph Freshness
- Built from commit: `494314c0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- API contract and privileges
- Portal data and formatting
- HTTP API client
- Directories and activity navigation
- Web runtime dependencies
- Shared page actions and states
- Authentication and role enforcement
- Landing artwork and workout overlays
- API schema validation
- Authentication and onboarding forms
- Development demo fixtures
- Full stack audit evidence
- Membership editing forms
- Portal shells and profile controls
- Program and goal form controls
- Monorepo workspace commands
- Membership approval lifecycle
- Athlete detail coaching workflows
- Workout and notification state
- Motion and activity capsules
- Backend Fixes tests
- Program prescription persistence
- Payment and workout data formatting
- Role navigation and authorization
- Security tests
- Shared API data types
- Account and navigation menus
- Analytics chart rendering
- Web testing dependencies
- Authz Fixes tests
- Database and readiness models
- Account form validation
- Nav.Spec browser tests
- Web build dependencies
- Conversation participant access
- Continuous integration verification
- User experience laws
- Dashboard and attendance responses
- Development fixture seeding
- Historical engineering decisions
- Project operations guidance
- Membership editing forms
- Analytics chart rendering
- Identity and message mutations
- TypeScript workspace configuration
- Portal dashboard metrics
- API contract regression tests
- Operational analytics queries
- Project decisions and publication
- Analytics and branch tests
- Financial record persistence
- Shared design rules
- UI audit and validation
- Canonical UI layout principles
- Approved UI upgrade plan
- Portal actions and controls
- Session caches and analytics
- Optimistic mutation rollback
- Permission and timezone regression tests
- Root providers and layout
- Exercise metadata and forms
- Route Coverage tests
- Turbo workspace build tasks
- Accessibility and WCAG principles
- Next Config build configuration
- Reception and attendance workflows
- Shared API data types
- Chart theme integration
- Agent synchronization tooling
- Response and account routing
- Membership plan permissions
- Backend dependency versions
- Typography design principles
- Backend architecture and operations
- Spacing and accessibility principles
- Settings and membership form fields
- Skeleton UI behavior
- Goal metadata and contracts
- Session caches and analytics
- Conversation access regression tests
- Password reset lifecycle tests
- Membership lifecycle regression tests
- Notifications and profile state
- Paginated API list loading
- Conftest tests
- Shared design system
- Accessible interaction principles
- Persistent portal messages
- Motion and activity capsules
- Membership Approval tests
- Agent session history
- Web workspace commands
- QR attendance entry
- Animated metric tiles
- Portal error recovery views
- Agent synchronization tooling
- Shared design system
- Agent coordination protocol
- Jalali attendance calendar
- Historical fitness design direction
- Private PWA cache rules
- Coach programs editing
- Web testing dependencies
- Runtime and seed configuration
- Reserved shared package planning
- Activity capsule design rules
- Offline recovery controls
- Portal notification badges
- Desktop dark exercise library
- Desktop light exercise library
- Mobile dark exercise library
- Mobile light exercise library
- Desktop dark goal editor
- Desktop light goal editor
- Mobile dark goal editor
- Mobile light goal editor
- Desktop dark landing hero
- Desktop light landing hero
- Mobile dark landing hero
- Mobile light landing hero
- Earlier dark landing screenshot
- Earlier light landing screenshot
- Desktop dark admin settings
- Desktop light admin settings
- Mobile dark admin settings
- Mobile light admin settings
- Activity history portrait screenshot
- Lumi portrait landing screenshot
- Antigravity synchronization protocol
- Desktop Lumi landing screenshot
- Installed Next.js contributor guidance
- Not Found source relationships
- Not Found source relationships
- Not Found source relationships
- Playfair Display license obligations
- Shared portal UI primitives
- Shared portal UI primitives
- Vercel build configuration
- Unhandled application error responses
- Light activity capsule screenshot
- Activity capsule hover screenshot
- Dark activity capsule screenshot
- Peach Lumi logo identity
- Transparent Lumi logo identity
- White Lumi logo identity
- Lumi social preview identity
- Vazirmatn font license obligations
- Jakarta Sans license obligations
- Route titles and tests
- Touch icon 152 identity
- Touch icon 167 identity
- Touch icon 180 identity
- Outlined favicon identity
- PWA icon 192 identity
- PWA icon 512 identity
- Dark Lumi logo identity
- White Lumi logo outline
- Dashboard route regression tests
- Notification ownership regression tests
- Revenue shape regression tests
- Explicit checkout regression tests
- Reception conversation isolation tests
- Exercise dependency regression tests
- Payment status regression tests
- Program prescription CRUD tests
- Management renewal entitlement
- Chat message wire naming
- Conversation message data models
- Membership derived field exclusions
- Original gym PWA concept

## God Nodes (most connected - your core abstractions)
1. `API Contract v2` - 137 edges
2. `Button` - 135 edges
3. `react` - 123 edges
4. `User` - 121 edges
5. `cn()` - 106 edges
6. `success_response()` - 102 edges
7. `lucide-react` - 99 edges
8. `ApiClient` - 98 edges
9. `formatPersianNumber()` - 92 edges
10. `error_response()` - 88 edges

## Surprising Connections (you probably didn't know these)
- `Seven active session day capsule window` --semantically_similar_to--> `Activity capsules documented contract`  [INFERRED] [semantically similar]
  .context/STATE.md → docs/DESIGN_SYSTEM.md
- `Owner and goal scoped browser history draft` --semantically_similar_to--> `History-safe goal draft and old categories`  [INFERRED] [semantically similar]
  .context/STATE.md → docs/UI_UX_AUDIT_2026-11-06.md
- `Semantic accent roles` --semantically_similar_to--> `Hero positioning and input contrast repair`  [INFERRED] [semantically similar]
  docs/DESIGN_SYSTEM.md → .context/STATE.md
- `Lumi Wellness README` --cites--> `API Contract v2`  [EXTRACTED]
  README.md → docs/API_CONTRACT_V2.md
- `Lumi Wellness README` --cites--> `Fullstack Audit November 6`  [EXTRACTED]
  README.md → docs/FULLSTACK_AUDIT_2026-11-06.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Membership request and approval flow** — docs_api_contract_v2_idempotent_athlete_renewal_request, docs_api_contract_v2_admin_only_renewal_entitlement, docs_api_contract_v2_renewal_audit_metadata, docs_api_contract_v2_membership_approval_migration0003 [EXTRACTED 1.00]

## Communities (190 total, 53 thin omitted)

### Community 0 - "API contract and privileges"
Cohesion: 0.02
Nodes (120): Account creation role and password policy, Account status role restrictions, Account update privilege boundary, addProgramExercise, Admin messaging observer, Admin-only role reset and delete, API Contract v2, API route prefix (+112 more)

### Community 1 - "Portal data and formatting"
Cohesion: 0.05
Nodes (73): StaffAccounts(), CalendarPage(), weekDays, CheckinPage(), toLocalInputValue(), labelFor(), READINESS_STATES, ReadinessWidget() (+65 more)

### Community 2 - "HTTP API client"
Cohesion: 0.05
Nodes (6): ApiClient, ApiResponse, CheckIn, Membership, MembershipInput, MembershipPlan

### Community 3 - "Directories and activity navigation"
Cohesion: 0.07
Nodes (58): fullName(), SortState, USER_ROLE, USER_STATUS, Panel(), PanelProps, QueryState(), QueryStateProps (+50 more)

### Community 4 - "Web runtime dependencies"
Cohesion: 0.04
Nodes (68): browserslist, dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, date-fns@^4.4.0, framer-motion@^12.42.2, @hookform/resolvers@^5.4.0, lucide-react@^1.26.0 (+60 more)

### Community 5 - "Shared page actions and states"
Cohesion: 0.14
Nodes (52): NewCoachPage(), CoachesPage(), NewMemberPage(), MemberRow, MembersPage(), StatusFilter, statusFilterLabels, statusFilterOptions (+44 more)

### Community 6 - "Authentication and role enforcement"
Cohesion: 0.08
Nodes (28): check_login_rate_limit(), create_access_token(), create_refresh_token(), decode_token(), generate_reset_token(), get_client_ip(), get_current_user(), get_optional_user() (+20 more)

### Community 7 - "Landing artwork and workout overlays"
Cohesion: 0.05
Nodes (37): ControlledRow(), exercise, WorkoutExerciseRow(), WorkoutExerciseRowProps, RootError(), NotFound(), metadata, OfflinePage() (+29 more)

### Community 8 - "API schema validation"
Cohesion: 0.06
Nodes (30): change_password(), create_user(), delete_user(), get_user(), list_users(), update_user(), update_user_role(), update_user_status() (+22 more)

### Community 9 - "Authentication and onboarding forms"
Cohesion: 0.07
Nodes (46): MembershipApproval(), ForgotFormData, ForgotPasswordPage(), requestLink(), forgotSchema, DemoAccount, LoginPage(), MOCK_DEMO_ACCOUNTS (+38 more)

### Community 10 - "Development demo fixtures"
Cohesion: 0.07
Nodes (41): ATTENDANCE_BY_WEEKDAY, CHECK_INS_BY_HOUR, clamp(), createAthleteActivity(), createAttendanceTrend(), createMockNotifications(), createMockPrograms(), createPeakHours() (+33 more)

### Community 11 - "Full stack audit evidence"
Cohesion: 0.04
Nodes (49): Alembic temporary-database lifecycle, Atomic account and real form saves, Atomic identity validation, Audit scope and evidence boundary, Coach program workflow, Coach roster goals and messages, Cross-database FK migration work, Current browser landmarks tests (+41 more)

### Community 12 - "Membership editing forms"
Cohesion: 0.10
Nodes (38): AssignProgramFormData, assignProgramSchema, AssignProgramSheet(), FREQUENCY_OPTIONS, InfoRow(), programStatusConfig, toIsoDate(), Field() (+30 more)

### Community 13 - "Portal shells and profile controls"
Cohesion: 0.06
Nodes (35): registerSchema, PageHeader(), PageHeaderProps, TargetController, AthleteShell(), DOCK_ICONS, DOCK_MAX, NavIconName (+27 more)

### Community 14 - "Program and goal form controls"
Cohesion: 0.09
Nodes (40): GoalCreateSheet(), CloneFields(), CloneFormValues, CloneProgramSheet(), CloneProgramSheetProps, CloneProgramValues, cloneSchema, GoalFields() (+32 more)

### Community 15 - "Monorepo workspace commands"
Cohesion: 0.05
Nodes (49): dependencies, @hookform/resolvers@^5.4.0, @radix-ui/react-avatar@^1.2.4, @radix-ui/react-checkbox@^1.3.9, @radix-ui/react-dialog@^1.1.21, @radix-ui/react-dropdown-menu@^2.1.22, @radix-ui/react-label@^2.1.13, @radix-ui/react-popover@^1.1.21 (+41 more)

### Community 16 - "Membership approval lifecycle"
Cohesion: 0.13
Nodes (28): Membership, Notification, _encode(), error_response(), log_exception(), paginated_response(), success_response(), create_membership() (+20 more)

### Community 17 - "Athlete detail coaching workflows"
Cohesion: 0.13
Nodes (36): CoachProfilePage(), InfoRow(), MemberProfilePage(), AdminDashboard(), AdminProfilePage(), StaffStats(), BLUSH_BADGE, MEMBER_PROGRESS_FILL (+28 more)

### Community 18 - "Workout and notification state"
Cohesion: 0.14
Nodes (26): ConfirmDialog(), ConfirmDialogProps, GoalDetailPage(), statuses, MembershipPage(), PAYMENT_METHODS, getRelativeTime(), NotificationsPage() (+18 more)

### Community 19 - "Motion and activity capsules"
Cohesion: 0.07
Nodes (35): Meter(), MeterProps, toneMap, Pressable, PressableProps, roundedMap, Shimmer, ShimmerProps (+27 more)

### Community 20 - "Backend Fixes tests"
Cohesion: 0.07
Nodes (28): _shift_months(), _authz(), _clear_rate_limits(), client(), _email(), _ensure_checked_out(), ids(), _login() (+20 more)

### Community 21 - "Program prescription persistence"
Cohesion: 0.13
Nodes (29): Exercise, ProgramExercise, TrainingProgram, create_exercise(), delete_exercise(), get_exercise(), list_exercises(), update_exercise() (+21 more)

### Community 22 - "Payment and workout data formatting"
Cohesion: 0.10
Nodes (27): BadgeVariant, LabelledVariant, MEMBERSHIP_STATUS, PAYMENT_METHOD, PAYMENT_STATUS, SortDir, diffColors, diffLabels (+19 more)

### Community 23 - "Role navigation and authorization"
Cohesion: 0.10
Nodes (29): adminDockItems, adminNavItems, p, AdminLayout(), athleteDockItems, athleteNavItems, iconProps, AthleteLayout() (+21 more)

### Community 24 - "Security tests"
Cohesion: 0.08
Nodes (21): _authz(), _branch_id(), _clear_rate_limits(), client(), _email(), ids(), _login(), _pin_rate_limit() (+13 more)

### Community 25 - "Shared API data types"
Cohesion: 0.08
Nodes (26): axios@^1.18.1, membershipStatusConfig, paymentStatusConfig, ProgramExerciseRowProps, ProgramExerciseSheetProps, api, API_BASE_URL, AthleteActivityPoint (+18 more)

### Community 26 - "Account and navigation menus"
Cohesion: 0.11
Nodes (29): ALL_STATUSES, EditPaymentFormData, editPaymentSchema, EditPaymentSheet(), NewPaymentFormData, newPaymentSchema, NewPaymentSheet(), PaymentRowActions() (+21 more)

### Community 27 - "Analytics chart rendering"
Cohesion: 0.09
Nodes (27): persianFigure(), StatCard(), StatCardProps, SessionDurationChartLazy, AthleteActivityChart(), AthleteProgressChart(), AttendanceTrendChart(), chartDate() (+19 more)

### Community 28 - "Web testing dependencies"
Cohesion: 0.10
Nodes (20): member, mocks, mocks, goal, mocks, mocks, mocks, athlete (+12 more)

### Community 29 - "Authz Fixes tests"
Cohesion: 0.10
Nodes (26): _authz(), _clear_rate_limits(), client(), _complete(), _email(), goals(), ids(), _admin_create() (+18 more)

### Community 30 - "Database and readiness models"
Cohesion: 0.10
Nodes (11): get_db(), DailyReadiness, _utcnow_naive(), get_readiness(), readiness_history(), ReadinessInput, save_readiness(), today() (+3 more)

### Community 31 - "Account form validation"
Cohesion: 0.09
Nodes (26): IdentityFormData, identitySchema, newPasswordField, NewUserFormData, newUserSchema, NOTIFICATION_TYPE_LABEL, NOTIFICATION_TYPE_OPTIONS, PAYMENT_EDITABLE_STATUSES (+18 more)

### Community 32 - "Nav.Spec browser tests"
Cohesion: 0.10
Nodes (9): PORTALS, PORTALS, api, signIn(), HERO_PAGES, PUBLIC_ROUTES, AA_PAIRS, PORT (+1 more)

### Community 33 - "Web build dependencies"
Cohesion: 0.06
Nodes (31): devDependencies, autoprefixer@^10.5.4, eslint@^10.8.1, eslint-config-next@^16.3.8, @eslint/eslintrc@^3.2.0, jsdom@^29.1.1, @playwright/test@^1.63.0, postcss@^8.5.22 (+23 more)

### Community 34 - "Conversation participant access"
Cohesion: 0.20
Nodes (21): Conversation, Message, User, _conversation_payload(), create_conversation(), get_conversation(), _is_participant(), _last_message() (+13 more)

### Community 35 - "Continuous integration verification"
Cohesion: 0.08
Nodes (31): env, runs-on, steps, runs-on, steps, DATABASE_URL, E2E_PYTHON, SECRET_KEY (+23 more)

### Community 37 - "Dashboard and attendance responses"
Cohesion: 0.15
Nodes (18): require_roles(), CheckIn, check_in(), check_out(), check_out_post(), list_checkins(), qr_check_in(), void_check_in() (+10 more)

### Community 38 - "Development fixture seeding"
Cohesion: 0.14
Nodes (14): health(), lifespan(), root(), _attendance_plan(), _ensure(), _ensure_branch(), _ensure_exercise(), _ensure_plan() (+6 more)

### Community 39 - "Historical engineering decisions"
Cohesion: 0.06
Nodes (21): Accent theme inversion, Calm meditation visual language, Canonical monorepo unification, Daily revenue and explicit checkout, Dated Final Engineering Report, Dated Lighthouse improvements, Deliberate capability omissions, Dense analytics series (+13 more)

### Community 40 - "Project operations guidance"
Cohesion: 0.07
Nodes (27): Activity capsule chart, Admin renewal approval, Alembic migrations available, AuthProvider and RequireAuth, Backend environment contracts, Build-time public configuration, Calm dual-theme design, Coach program and blueprint operations (+19 more)

### Community 41 - "Membership editing forms"
Cohesion: 0.13
Nodes (27): dateInputOf(), FreezeForm(), FreezeFormData, freezeSchema, FreezeSheet(), FreezeSheetProps, MEMBERSHIP_ACTION_LABEL, MembershipForm() (+19 more)

### Community 42 - "Analytics chart rendering"
Cohesion: 0.11
Nodes (27): AthleteActivityChart(), AthleteActivityChartLazy, AthleteActivityChartProps, AthleteProgressChart(), AthleteProgressChartLazy, AthleteProgressChartProps, AttendanceTrendChart(), AttendanceTrendChartLazy (+19 more)

### Community 43 - "Identity and message mutations"
Cohesion: 0.11
Nodes (21): requireUserId(), applyGoalProgress(), markExercise(), useChangePassword(), useCreateBranch(), useCreateMembershipPlan(), useDeleteBranch(), useDeleteExercise() (+13 more)

### Community 44 - "TypeScript workspace configuration"
Cohesion: 0.08
Nodes (24): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+16 more)

### Community 45 - "Portal dashboard metrics"
Cohesion: 0.16
Nodes (11): Goal, _check_goal_assignment(), create_goal(), delete_goal(), get_goal(), list_goals(), update_goal(), update_goal_progress() (+3 more)

### Community 46 - "API contract regression tests"
Cohesion: 0.09
Nodes (4): _iso(), test_goal_delete_rejects_unrelated_athlete(), test_goal_update_and_delete(), test_membership_plan_soft_delete_when_referenced()

### Community 47 - "Operational analytics queries"
Cohesion: 0.18
Nodes (15): athlete_activity(), attendance_trend(), _day_buckets(), _day_window(), membership_distribution(), _month_buckets(), _month_window(), peak_hours() (+7 more)

### Community 48 - "Project decisions and publication"
Cohesion: 0.09
Nodes (8): Current UI handoff objective, Explicit repository root file tracing, Historical fullstack completion record, Live Project State, Lumi Wellness monorepo architecture, Multi Agent Sync v2 governance, Outstanding production and dependency limitations, UI completion and verification record

### Community 49 - "Analytics and branch tests"
Cohesion: 0.09
Nodes (23): _data(), test_athlete_activity(), test_attendance_trend(), test_branch_create_update_delete(), test_branch_delete_conflicts_when_populated(), test_conversation_participant_is_athlete_for_admin(), test_conversation_participant_is_other_party_for_coach(), test_create_conversation_from_coach_side() (+15 more)

### Community 50 - "Financial record persistence"
Cohesion: 0.17
Nodes (10): Payment, create_payment(), get_payment(), list_payments(), update_payment(), update_payment_status(), PaymentCreate, PaymentResponse (+2 more)

### Community 51 - "Shared design rules"
Cohesion: 0.09
Nodes (12): Accessibility contract, Agent file ownership map, Associated form errors and async live status, Bundle props touch and RTL hard rules, Design System v2 Coordination Specification, Historical Lighthouse accessibility claim, November goal draft and SVG update, November overlay receipt and directory update (+4 more)

### Community 52 - "UI audit and validation"
Cohesion: 0.09
Nodes (10): Backend verification rerun before PR, Final graph publication destination and baseline distinction, Historical local Graphify orientation evidence, Independent review and regression corrections, Operational and physical-device evidence limits, Previous fullstack continuity, Reported final automated verification, Reported final route and screenshot evidence (+2 more)

### Community 53 - "Canonical UI layout principles"
Cohesion: 0.10
Nodes (19): Canonical grid layouts, Color hierarchy, Content sized badges, Contextual heading caps, Control geometry consistency, Design constraints, Design thinking, Elevation meaning (+11 more)

### Community 54 - "Approved UI upgrade plan"
Cohesion: 0.10
Nodes (16): Execution ledger reported completion and publication authorization, Review focus for forms navigation and viewports, Task 1 shared fields and controls completion, Task 2 shell overlays and navigation completion, Task 3 athlete goal workflow completion, Task 4 remaining athlete interactions completion, Task 5 consistency and URL state completion, Task 6 verification and handoff checklist (+8 more)

### Community 55 - "Portal actions and controls"
Cohesion: 0.22
Nodes (15): difficultyOptions, emptyExerciseValues, ExerciseForm(), ExerciseFormProps, ExerciseFormValues, exerciseSchema, ExerciseSuggestions, toExerciseFormValues() (+7 more)

### Community 56 - "Session caches and analytics"
Cohesion: 0.18
Nodes (14): loadMockService(), MockService, mockService, MockServiceKeys, Q, QuerySnapshot, USE_MOCK, useAthleteActivity() (+6 more)

### Community 57 - "Optimistic mutation rollback"
Cohesion: 0.25
Nodes (16): currentUserId(), patchItemQueries(), patchListQueries(), restoreQueries(), snapshotQueries(), CONTRACT_V2_METHODS, Row, useCompleteProgramExercise() (+8 more)

### Community 58 - "Permission and timezone regression tests"
Cohesion: 0.12
Nodes (6): member(), test_goal_creation_cannot_bypass_existing_coaching_permissions(), test_admin_identity_edits_reject_invalid_values_atomically(), test_null_profile_fields_are_rejected_before_corrupting_an_account(), test_reception_cannot_create_privileged_accounts(), test_reception_cannot_edit_privileged_login_identity()

### Community 59 - "Root providers and layout"
Cohesion: 0.14
Nodes (11): bodoni, estedad, estedadLatin, metadata, montserrat, RootLayout(), vazirmatn, viewport (+3 more)

### Community 60 - "Exercise metadata and forms"
Cohesion: 0.12
Nodes (12): ProgramDetailsPatch, ProgramDetailsSheetProps, BadgeVariant, DIFFICULTIES, difficultyLabels, difficultyVariants, PROGRAM_STATUSES, programStatusConfig (+4 more)

### Community 61 - "Route Coverage tests"
Cohesion: 0.15
Nodes (6): _client_calls(), coverage(), _normalise(), _server_operations(), test_declared_aliases_are_still_aliases(), test_no_client_method_calls_a_route_that_does_not_exist()

### Community 62 - "Turbo workspace build tasks"
Cohesion: 0.12
Nodes (16): dependsOn, outputs, cache, persistent, globalEnv, outputs, $schema, tasks (+8 more)

### Community 63 - "Accessibility and WCAG principles"
Cohesion: 0.12
Nodes (13): Focus visibility, Hover and focus content, Keyboard navigation, Non-text contrast, Reduced motion, Semantic landmarks and skip navigation, Text contrast thresholds, Text resizing and reflow (+5 more)

### Community 64 - "Next Config build configuration"
Cohesion: 0.14
Nodes (8): assertDeployEnv(), CONTENT_SECURITY_POLICY, __dirname, __filename, nextConfig, SECURITY_HEADERS, STATIC_ASSET_CACHE, deployBuild

### Community 65 - "Reception and attendance workflows"
Cohesion: 0.23
Nodes (13): CheckInsPage(), handleCheckout(), handleVoid(), currentTimeInput(), errorMessage(), isToday(), resolveName(), STATUS_FILTERS (+5 more)

### Community 66 - "Shared API data types"
Cohesion: 0.16
Nodes (11): UserSheetProps, NewConversationSheetProps, AuthContextType, AuthResponse, RequireAuthProps, AuthPayload, AuthTokens, Notification (+3 more)

### Community 67 - "Chart theme integration"
Cohesion: 0.21
Nodes (11): chartSurface(), ChartTheme, FALLBACK, getServerSnapshot(), getSnapshot(), Listener, listeners, read() (+3 more)

### Community 69 - "Response and account routing"
Cohesion: 0.29
Nodes (9): Branch, create_branch(), delete_branch(), get_branch(), list_branches(), update_branch(), BranchCreate, BranchResponse (+1 more)

### Community 70 - "Membership plan permissions"
Cohesion: 0.30
Nodes (9): MembershipPlan, create_plan(), delete_plan(), get_plan(), list_plans(), update_plan(), MembershipPlanCreate, MembershipPlanResponse (+1 more)

### Community 71 - "Backend dependency versions"
Cohesion: 0.13
Nodes (15): alembic1.20.0, bcrypt4.0.1, cryptography50.0.0, FastAPI0.142.2, httpx0.28.1, passlib1.7.4, Pinned Backend Python Dependencies, Pydantic2.9.2 (+7 more)

### Community 73 - "Typography design principles"
Cohesion: 0.14
Nodes (12): Brand type voice, Display heading line height, Heading semantic and visual roles, Localization and RTL typography, Minimum font sizes, Modular type scale, Readability triad, Responsive fluid typography (+4 more)

### Community 74 - "Backend architecture and operations"
Cohesion: 0.14
Nodes (14): Branch, CheckIn, Conversation, Exercise, FastAPI backend, Goal, Membership, MembershipPlan (+6 more)

### Community 75 - "Spacing and accessibility principles"
Cohesion: 0.15
Nodes (7): TypeUI Design Fundamentals, Heading paragraph spacing, Horizontal utility clusters, Responsive spacing, Spacing Principles, Spacing tiers, Vertical rhythm

### Community 76 - "Settings and membership form fields"
Cohesion: 0.19
Nodes (8): FieldControlProps, FieldProps, BranchForm(), BranchFormData, branchSchema, SettingsRow(), Label, labelVariants

### Community 77 - "Skeleton UI behavior"
Cohesion: 0.37
Nodes (8): AdminLoading(), AthleteLoading(), CoachLoading(), CardSkeleton(), ListSkeleton(), PageSkeleton(), Skeleton(), TableSkeleton()

### Community 78 - "Goal metadata and contracts"
Cohesion: 0.15
Nodes (11): GOAL_CATEGORIES, goalCategoryIndicator, goalCategoryLabels, goalStatusConfig, GoalCreatePatch, GoalSheetProps, BadgeVariant, GOAL_STATUSES (+3 more)

### Community 79 - "Session caches and analytics"
Cohesion: 0.24
Nodes (11): isValidStoredUser(), AuthContext, AuthProvider(), readStored(), RegisterData, storeFor(), StoreKind, api (+3 more)

### Community 80 - "Conversation access regression tests"
Cohesion: 0.15
Nodes (10): _conversation_of(), test_admin_can_read_any_conversation(), test_conversation_lists_are_paginated(), test_conversation_response_shape(), test_message_response_shape_and_ascending(), test_non_participant_cannot_touch_conversation(), test_non_participant_coach_cannot_read_conversation(), test_send_message_bumps_last_message_at() (+2 more)

### Community 81 - "Password reset lifecycle tests"
Cohesion: 0.15
Nodes (11): _register(), test_change_password_enforces_policy(), test_change_password_flow(), test_new_reset_request_invalidates_outstanding_token(), test_password_reset_end_to_end(), test_reset_token_is_single_use(), test_reset_token_stored_hashed_only(), test_update_profile() (+3 more)

### Community 82 - "Membership lifecycle regression tests"
Cohesion: 0.15
Nodes (9): test_admin_sets_password_without_the_current_one(), test_freeze_is_rejected_unless_the_membership_is_active(), test_membership_writes_are_staff_only(), test_password_set_enforces_the_policy_and_ownership(), test_self_service_password_still_needs_the_current_one(), test_user_status_patch(), test_user_status_patch_validation_and_role_gate(), _throwaway_membership() (+1 more)

### Community 83 - "Notifications and profile state"
Cohesion: 0.23
Nodes (11): audienceLabel(), BroadcastPage(), loadHistory(), Mode, modeLabels, modeOptions, SentLogEntry, targetOptions (+3 more)

### Community 85 - "Conftest tests"
Cohesion: 0.26
Nodes (6): _auth(), client(), _isolate_rate_limiter(), _login(), seeded(), tokens()

### Community 87 - "Shared design system"
Cohesion: 0.17
Nodes (9): Below fold content visibility, Historical primary-solid contrast, Lazy client graph slimming, Lighthouse production method, Measured P2 performance roadmap, October Lighthouse remeasurement, Performance and UX Audit, Responsive UX followups (+1 more)

### Community 88 - "Accessible interaction principles"
Cohesion: 0.18
Nodes (10): Accessible state semantics, Button feedback timing, Error recovery state, Hover and active technique palettes, Interaction and Control Principles, Navigation link treatment, Nine-state button contract, Orthogonal button type style state (+2 more)

### Community 89 - "Persistent portal messages"
Cohesion: 0.38
Nodes (7): Page(), Page(), MessagesInner(), MessagesPage(), useConversations(), useCreateConversation(), useMessages()

### Community 90 - "Motion and activity capsules"
Cohesion: 0.27
Nodes (8): buildCapsuleDays(), CapsuleCheckIn, CapsuleDay, capsulePercent(), dayKey(), FA_WEEKDAY, sessionMinutes(), NOW

### Community 91 - "Membership Approval tests"
Cohesion: 0.38
Nodes (9): own_membership(), test_admin_approval_persists_and_rejects_shortening_the_term(), test_admin_membership_edit_persists_the_fields_the_form_offers(), test_athlete_cannot_grant_themselves_a_new_term(), test_inconsistent_membership_price_edit_is_rejected_atomically(), test_reception_cannot_approve_a_renewal(), test_reception_cannot_bypass_approval_by_creating_another_term(), test_reception_cannot_bypass_approval_through_generic_edit() (+1 more)

### Community 92 - "Agent session history"
Cohesion: 0.22
Nodes (8): Activity capsule redesign and Lumi rename November 1, Fresh browser review and authorized publication preparation, Fullstack admin and coach completion November 6, Initial local Graphify corpus and preserved snapshot, Multi Agent Session History, Publication continuation November 6, UI upgrade session reported verification, Vercel and Next.js deployment audit November 1

### Community 93 - "Web workspace commands"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, start, test, test:e2e, test:e2e:real (+1 more)

### Community 94 - "QR attendance entry"
Cohesion: 0.33
Nodes (8): BarcodeDetectorCtor, BarcodeDetectorInstance, cameraAvailable(), DetectedBarcode, getDetectorCtor(), QrEntry(), startScan(), QrEntryProps

### Community 95 - "Animated metric tiles"
Cohesion: 0.33
Nodes (6): AnimatedCounter(), AnimatedCounterProps, DeltaChip(), StatTile(), StatTileProps, toneMap

### Community 96 - "Portal error recovery views"
Cohesion: 0.46
Nodes (4): AdminError(), AthleteError(), CoachError(), PortalErrorView()

### Community 97 - "Agent synchronization tooling"
Cohesion: 0.39
Nodes (4): _origin_allowed(), test_explicit_origin_list_still_allowed(), test_foreign_origin_not_allowed_by_regex(), test_preview_origin_allowed_by_regex()

### Community 98 - "Shared design system"
Cohesion: 0.25
Nodes (8): Activity ring and actions demo, Category and workout row demo, Copied semantic palette, Dark and light comparison panes, Dual Theme Design Preview, Stats and personal accent demo, Theme palette swatches, Weekly pill track demo

### Community 99 - "Agent coordination protocol"
Cohesion: 0.29
Nodes (6): Atomic context commit, Cairn tool ownership, Live state and Cairn plan, Multi-Agent Sync Protocol v2, Session lock, Claude Native Adapter

### Community 101 - "Jalali attendance calendar"
Cohesion: 0.48
Nodes (5): date-fns-jalali@^4.4.0-0, getJalaliMonth(), groupCheckinsByJalaliDay(), moveJalaliMonth(), date-fns-jalali

### Community 102 - "Historical fitness design direction"
Cohesion: 0.29
Nodes (7): Activity Rings, Apple HIG and iOS18 reference, Fitness mapping, Historical Apple Fitness Design Direction, SF Pro and Vazirmatn scale, Six step design plan, Translucent tab bar and sticky title

### Community 104 - "Coach programs editing"
Cohesion: 0.43
Nodes (7): confirmAction(), moveEntry(), saveDetails(), saveEntry(), saveOrders(), setStatus(), write()

### Community 105 - "Web testing dependencies"
Cohesion: 0.33
Nodes (3): entries, library, m

### Community 107 - "Reserved shared package planning"
Cohesion: 0.33
Nodes (5): Planned API client package, Planned config package, Planned UI package, Reserved Shared Turbo Workspaces, Shared workspaces empty by design

### Community 110 - "Offline recovery controls"
Cohesion: 0.70
Nodes (4): getOnlineServerSnapshot(), getOnlineSnapshot(), OfflineRetry(), subscribeOnline()

### Community 111 - "Portal notification badges"
Cohesion: 0.60
Nodes (4): PortalBadgeCounts, usePortalBadgeCounts(), useNotifications(), useUnreadMessageCount()

### Community 112 - "Desktop dark exercise library"
Cohesion: 0.40
Nodes (5): Add exercise and PWA installation, Dark coach portal shell, Desktop dark exercise library, Exercise directory table and management actions, Exercise search and muscle level filters

### Community 113 - "Desktop light exercise library"
Cohesion: 0.40
Nodes (5): Desktop light exercise library, Exercise creation and install banner, Exercise table actions and status pills, Light exercise filtering controls, Warm paper coach shell

### Community 114 - "Mobile dark exercise library"
Cohesion: 0.40
Nodes (5): Compact coach header and navigation, Mobile dark exercise library, Mobile library title add and search, Narrow exercise table and filter strip, PWA and floating accessibility controls

### Community 115 - "Mobile light exercise library"
Cohesion: 0.40
Nodes (5): Light compact coach shell, Mobile bronze creation and filters, Mobile light exercise library, Mobile white install banner, Responsive light exercise table

### Community 116 - "Desktop dark goal editor"
Cohesion: 0.40
Nodes (5): Athlete sidebar and return navigation, Desktop dark athlete goal editor, Goal page secondary overlays, Populated goal editing fields, Weight goal progress summary

### Community 117 - "Desktop light goal editor"
Cohesion: 0.40
Nodes (5): Desktop light athlete goal editor, Install banner and lower form controls, Light populated goal form, Light weight goal summary, Warm paper athlete portal

### Community 118 - "Mobile dark goal editor"
Cohesion: 0.40
Nodes (5): Mobile athlete goal header, Mobile dark athlete goal editor, Mobile goal editing section, Mobile installation and athlete dock, Stacked weight progress card

### Community 119 - "Mobile light goal editor"
Cohesion: 0.40
Nodes (5): Goal form install and dock overlays, Light mobile progress summary, Mobile light athlete goal editor, Stacked light goal form, Warm compact goal navigation

### Community 120 - "Desktop dark landing hero"
Cohesion: 0.40
Nodes (5): Atmospheric gym backdrop and overlays, Dark motivational hero and actions, Desktop dark public landing hero, Desktop public navigation, Sample daily progress artwork

### Community 121 - "Desktop light landing hero"
Cohesion: 0.40
Nodes (5): Dark artwork within light landing theme, Desktop light public landing hero, Light theme landing action foregrounds, Sample daily activity preview, Warm public navigation bar

### Community 122 - "Mobile dark landing hero"
Cohesion: 0.40
Nodes (5): Compact public membership header, Full-width landing actions, Mobile dark public landing hero, Sample preview and install overlap, Stacked Persian motivational copy

### Community 123 - "Mobile light landing hero"
Cohesion: 0.40
Nodes (5): Fixed dark mobile hero art, Light compact public header, Light install banner over preview, Mobile light public landing hero, Theme-aware stacked signup actions

### Community 124 - "Earlier dark landing screenshot"
Cohesion: 0.40
Nodes (5): Before daily progress preview, Before dark public navigation and hero, Before installation overlay, Before narrow hero copy and actions, Mobile dark landing before upgrade

### Community 125 - "Earlier light landing screenshot"
Cohesion: 0.40
Nodes (5): Before dark preview and white install banner, Before low visibility hero headline, Before narrow copy and signup controls, Before warm public header, Mobile light landing before upgrade

### Community 126 - "Desktop dark admin settings"
Cohesion: 0.40
Nodes (5): Club branch settings fields, Dark admin navigation shell, Desktop dark admin settings, Settings save plans and install actions, Staff account management list

### Community 127 - "Desktop light admin settings"
Cohesion: 0.40
Nodes (5): Bronze save and plans actions, Desktop light admin settings, Light staff account controls, Outlined club settings form, Warm admin settings shell

### Community 128 - "Mobile dark admin settings"
Cohesion: 0.40
Nodes (5): Compact dark admin shell, Install banner on admin form, Mobile club settings section, Mobile dark admin settings, Stacked staff management section

### Community 129 - "Mobile light admin settings"
Cohesion: 0.40
Nodes (5): Compact warm admin settings shell, Light club branch form start, Light staff accounts and creation controls, Mobile light admin settings, White installation banner and accessibility

### Community 130 - "Activity history portrait screenshot"
Cohesion: 0.50
Nodes (4): Active-day capsule display, Activity history portrait screenshot, Attendance duration table, Floating dock navigation

### Community 131 - "Lumi portrait landing screenshot"
Cohesion: 0.50
Nodes (4): Landing action buttons, Lumi wordmark, Portrait Lumi landing screenshot, Women gym platform hero

### Community 132 - "Antigravity synchronization protocol"
Cohesion: 0.50
Nodes (4): Agent lock protocol, Antigravity Agent Sync Rules, Atomic session handoff, Cairn checkpoints

### Community 133 - "Desktop Lumi landing screenshot"
Cohesion: 0.50
Nodes (4): Activity ring preview, Desktop hero layout, Desktop Lumi landing screenshot, PWA install banner

### Community 134 - "Installed Next.js contributor guidance"
Cohesion: 0.50
Nodes (3): Installed Next.js documentation, Next.js Generated Agent Rules, Web Claude Adapter

### Community 139 - "Playfair Display license obligations"
Cohesion: 0.67
Nodes (4): Playfair Display, Playfair Display Font License, Reserved Font Name Playfair Display, SIL Open Font License1.1

### Community 140 - "Shared portal UI primitives"
Cohesion: 0.50
Nodes (3): Chip, ChipProps, toneMap

### Community 142 - "Vercel build configuration"
Cohesion: 0.50
Nodes (3): buildCommand, framework, $schema

### Community 144 - "Light activity capsule screenshot"
Cohesion: 0.67
Nodes (3): Activity readout and table, Capsule chart light screenshot, Rose capsule chart

### Community 145 - "Activity capsule hover screenshot"
Cohesion: 0.67
Nodes (3): Capsule chart hover screenshot, Dark pink capsule chart, Hover duration tooltip

### Community 146 - "Dark activity capsule screenshot"
Cohesion: 0.67
Nodes (3): Capsule chart dark screenshot, Dark activity capsule state, Persian activity summary

### Community 148 - "Peach Lumi logo identity"
Cohesion: 0.67
Nodes (3): Peach brand palette, Peach Lumi Wellness logo, Serif and sans brand pairing

### Community 149 - "Transparent Lumi logo identity"
Cohesion: 0.67
Nodes (3): Serif and sans brand pairing, Transparent Lumi Wellness logo, Transparent wordmark composition

### Community 150 - "White Lumi logo identity"
Cohesion: 0.67
Nodes (3): Serif and sans brand pairing, White background Lumi Wellness logo, White brand presentation

### Community 151 - "Lumi social preview identity"
Cohesion: 0.67
Nodes (3): Lumi Wellness social preview, Smart gym management brand, Soft pink social composition

### Community 152 - "Vazirmatn font license obligations"
Cohesion: 1.00
Nodes (3): SIL Open Font License1.1, Vazirmatn, Vazirmatn Font License

### Community 153 - "Jakarta Sans license obligations"
Cohesion: 1.00
Nodes (3): Plus Jakarta Sans, Plus Jakarta Sans Font License, SIL Open Font License1.1

## Knowledge Gaps
- **490 isolated node(s):** `HTTPS origin client contract`, `Role mutation boundary`, `Branch CRUD and occupied delete`, `Account creation role and password policy`, `Account update privilege boundary` (+485 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1329 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Portal shells and profile controls` to `Portal data and formatting`, `Directories and activity navigation`, `Web runtime dependencies`, `Shared page actions and states`, `Landing artwork and workout overlays`, `Authentication and onboarding forms`, `Membership editing forms`, `Shared portal UI primitives`, `Program and goal form controls`, `Shared portal UI primitives`, `Athlete detail coaching workflows`, `Workout and notification state`, `Motion and activity capsules`, `Payment and workout data formatting`, `Role navigation and authorization`, `Account and navigation menus`, `Route titles and tests`, `Analytics chart rendering`, `Account form validation`, `Membership editing forms`, `Analytics chart rendering`, `Identity and message mutations`, `Portal actions and controls`, `Session caches and analytics`, `Root providers and layout`, `Reception and attendance workflows`, `Shared API data types`, `Chart theme integration`, `Settings and membership form fields`, `Session caches and analytics`, `Notifications and profile state`, `Persistent portal messages`, `QR attendance entry`, `Animated metric tiles`, `Portal error recovery views`, `Offline recovery controls`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 102 inferred relationships involving `User` (e.g. with `get_current_user()` and `get_optional_user()`) actually correct?**
  _`User` has 102 INFERRED edges - model-reasoned connections that need verification._
- **What connects `HTTPS origin client contract`, `Role mutation boundary`, `Branch CRUD and occupied delete` to the rest of the system?**
  _490 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API contract and privileges` be split into smaller, more focused modules?**
  _Cohesion score 0.015503875968992248 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Portal data and formatting` to `Directories and activity navigation`, `Web runtime dependencies`, `Shared page actions and states`, `Landing artwork and workout overlays`, `Not Found source relationships`, `Not Found source relationships`, `Authentication and onboarding forms`, `Not Found source relationships`, `Membership editing forms`, `Portal shells and profile controls`, `Athlete detail coaching workflows`, `Workout and notification state`, `Motion and activity capsules`, `Payment and workout data formatting`, `Role navigation and authorization`, `Account and navigation menus`, `Account form validation`, `Membership editing forms`, `Portal actions and controls`, `Reception and attendance workflows`, `Shared API data types`, `Settings and membership form fields`, `Notifications and profile state`, `Persistent portal messages`, `QR attendance entry`, `Animated metric tiles`, `Portal error recovery views`, `Offline recovery controls`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Should `Portal data and formatting` be split into smaller, more focused modules?**
  _Cohesion score 0.0547680412371134 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Payment and workout data formatting` to `Portal data and formatting`, `Directories and activity navigation`, `Web runtime dependencies`, `Shared page actions and states`, `Landing artwork and workout overlays`, `Not Found source relationships`, `Not Found source relationships`, `Authentication and onboarding forms`, `Not Found source relationships`, `Membership editing forms`, `Portal shells and profile controls`, `Athlete detail coaching workflows`, `Workout and notification state`, `Role navigation and authorization`, `Account and navigation menus`, `Analytics chart rendering`, `Route titles and tests`, `Portal actions and controls`, `Root providers and layout`, `Reception and attendance workflows`, `Shared API data types`, `Settings and membership form fields`, `Notifications and profile state`, `Persistent portal messages`, `Animated metric tiles`, `Portal error recovery views`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._

## Incremental refresh provenance and integrity

- Indexed 2026-11-06T12:33:29.987872+00:00; working-tree snapshot based on `494314c0a5eea986a191cdc6714b12cd6b65afe9`. Corpus: 393 files; 115 changed/new, including 91 code files, 6 fully read documents and 18 individually inspected images.
- Full source SHA-256 fingerprints, publication exceptions and semantic coverage are in `provenance.json`. Graph hash covers graph.json; snapshots/caches are local and excluded from Git.
- Merged extraction warning: self_loop_edges=1. The fresh changed-only extraction had 643 dangling endpoint edges before references to unchanged base files could be reconciled.
- Historical baseline raw extraction had 195 dangling endpoint edges, 1 self-loop and 294 collapsed relationships. Previously collapsed relationships cannot be recovered by this incremental merge; a low merged collapse count does not establish that historical multiplicity was restored.
- AST extraction reports pyproject.toml as yielding no nodes, intentional JSON-data skips, and files with only a file node. Do not treat source hashes as proof of full symbol coverage. Documented test results and visible screenshot semantics are evidence claims, not runtime verification by Graphify.
- The corpus includes five pre-existing untracked .context screenshots and generated next-env.d.ts; their publication exceptions are explicit in provenance. GitHub publication includes authored changes and shareable graph outputs only.
- `benchmark.txt` describes estimated query-context reduction, not measured token usage or runtime speed. Hosted Graphify MCP was unavailable; this is the user-authorized local graph refresh.
- Export guard override: Saved semantic identifiers for fully re-extracted changed documents were replaced. Every missing saved semantic node belongs to those covered sources; per-source semantic node counts did not shrink. The prior graph remains in ui-baseline-snapshot/.
