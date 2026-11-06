# Graph Report - Lumi-Wellness  (2026-11-06)

## Corpus Check
- 348 files · ~232,064 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: (none) 7, .woff2 4, .ttf 3)

## Summary
- 3054 nodes · 9306 edges · 170 communities (119 shown, 51 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 402 edges (avg confidence: 0.94)
- Token cost: unavailable; agent usage was not returned. Zero compatibility fields are not measured consumption.

## Community Hubs (Navigation)
- API contract and privileges
- Portal actions and controls
- Shared portal UI primitives
- Membership editing forms
- HTTP API client
- Web runtime dependencies
- Reception and attendance workflows
- Authentication and role enforcement
- API schema validation
- Notifications and profile state
- Development demo fixtures
- Full stack audit evidence
- Motion and activity capsules
- Monorepo workspace commands
- Athlete detail coaching workflows
- Analytics chart rendering
- Shared design system
- Web testing dependencies
- Shared API data types
- Backend Fixes tests
- Security tests
- Role navigation and authorization
- Response and account routing
- Authz Fixes tests
- Database and readiness models
- HTTP application error handling
- Conversation participant access
- Continuous integration verification
- User experience laws
- Portal dashboard metrics
- Historical engineering decisions
- Nav.Spec browser tests
- Formatting and athlete goals
- Financial record persistence
- Project operations guidance
- Session caches and analytics
- Web build dependencies
- Identity and message mutations
- Program prescription persistence
- Live project handoff
- Workout and notification state
- Membership approval lifecycle
- Landing page composition
- TypeScript workspace configuration
- API contract regression tests
- Account form validation
- Operational analytics queries
- Validated onboarding forms
- Portal notification badges
- Agent synchronization tooling
- Analytics and branch tests
- Root providers and layout
- Canonical UI layout principles
- Account and navigation menus
- Program cloning and dates
- Workout sound and animation
- Exercise metadata and forms
- Development fixture seeding
- Optimistic mutation rollback
- Membership plan permissions
- Notification persistence and roles
- Route Coverage tests
- Turbo workspace build tasks
- Accessibility and WCAG principles
- Next Config build configuration
- Newconversationsheet source relationships
- Chart theme integration
- Backend dependency versions
- Typography design principles
- Scroll reveal animation
- Backend architecture and operations
- Spacing and accessibility principles
- Payment reconciliation controls
- Skeleton UI behavior
- Coaching goal editing
- Authentication form validation
- Coach programs editing
- Conversation access regression tests
- Password reset lifecycle tests
- Membership lifecycle regression tests
- Mobile dock navigation
- Paginated API list loading
- Conftest tests
- Accessible interaction principles
- Auth login workflows
- Membership payment presentation
- Exercise prescription data types
- Exercise prescription editing
- Membership Approval tests
- Web workspace commands
- Auth register workflows
- Program metadata editing
- QR attendance entry
- Agent session history
- Portal error recovery views
- Animated metric tiles
- Privileged Account Edits tests
- Agent coordination protocol
- Jalali attendance calendar
- Historical fitness design direction
- Private PWA cache rules
- Athlete goal data contracts
- Runtime and seed configuration
- Reserved shared package planning
- Persistent portal messages
- Offline recovery controls
- Activity history portrait screenshot
- Lumi portrait landing screenshot
- Antigravity synchronization protocol
- Desktop Lumi landing screenshot
- Installed Next.js contributor guidance
- Not Found source relationships
- Membership plan form validation
- Not Found source relationships
- Not Found source relationships
- Playfair Display license obligations
- Vercel build configuration
- Unhandled application error responses
- Goal Creation Permissions tests
- Light activity capsule screenshot
- Activity capsule hover screenshot
- Dark activity capsule screenshot
- Management renewal entitlement
- Peach Lumi logo identity
- Transparent Lumi logo identity
- White Lumi logo identity
- Lumi social preview identity
-  Use Target source relationships
- Vazirmatn font license obligations
- Jakarta Sans license obligations
- Scenicbackground UI behavior
- Sceniccoursebackground UI behavior
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
- Chat message wire naming
- Conversation message data models
- Membership derived field exclusions
- Original gym PWA concept

## God Nodes (most connected - your core abstractions)
1. `cn()` - 164 edges
2. `API Contract v2` - 137 edges
3. `Button` - 134 edges
4. `react` - 123 edges
5. `User` - 121 edges
6. `formatPersianNumber()` - 110 edges
7. `success_response()` - 102 edges
8. `ApiClient` - 98 edges
9. `lucide-react` - 97 edges
10. `error_response()` - 88 edges

## Surprising Connections (you probably didn't know these)
- `Manager-only renewal entitlement` --semantically_similar_to--> `Admin-only renewal entitlement`  [INFERRED] [semantically similar]
  .context/STATE.md → docs/API_CONTRACT_V2.md
- `Multi-Agent Session History` --references--> `Fullstack Audit November 6`  [EXTRACTED]
  .context/SESSION_LOG.md → docs/FULLSTACK_AUDIT_2026-11-06.md
- `Live Project State November 6` --references--> `Fullstack Audit November 6`  [EXTRACTED]
  .context/STATE.md → docs/FULLSTACK_AUDIT_2026-11-06.md
- `Lumi Wellness README` --cites--> `API Contract v2`  [EXTRACTED]
  README.md → docs/API_CONTRACT_V2.md
- `Lumi Wellness README` --cites--> `Fullstack Audit November 6`  [EXTRACTED]
  README.md → docs/FULLSTACK_AUDIT_2026-11-06.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Membership request and approval flow** — docs_api_contract_v2_idempotent_athlete_renewal_request, docs_api_contract_v2_admin_only_renewal_entitlement, docs_api_contract_v2_renewal_audit_metadata, docs_api_contract_v2_membership_approval_migration0003 [EXTRACTED 1.00]

## Communities (170 total, 51 thin omitted)

### Community 0 - "API contract and privileges"
Cohesion: 0.02
Nodes (120): Account creation role and password policy, Account status role restrictions, Account update privilege boundary, addProgramExercise, Admin messaging observer, Admin-only role reset and delete, API Contract v2, API route prefix (+112 more)

### Community 1 - "Portal actions and controls"
Cohesion: 0.08
Nodes (68): NewCoachPage(), USER_STATUS, StaffAccounts(), NewMemberPage(), MemberRow, StatusFilter, statusFilterLabels, statusFilterOptions (+60 more)

### Community 2 - "Shared portal UI primitives"
Cohesion: 0.07
Nodes (72): CoachesPage(), SortState, persianFigure(), StatCard(), StatCardProps, PaginationBar(), PaginationBarProps, SearchFieldProps (+64 more)

### Community 3 - "Membership editing forms"
Cohesion: 0.08
Nodes (69): AssignProgramFormData, assignProgramSchema, AssignProgramSheet(), FREQUENCY_OPTIONS, programStatusConfig, toIsoDate(), Field(), FieldControlProps (+61 more)

### Community 4 - "HTTP API client"
Cohesion: 0.06
Nodes (4): ApiClient, ApiResponse, CheckIn, MembershipPlan

### Community 5 - "Web runtime dependencies"
Cohesion: 0.04
Nodes (69): browserslist, dependencies, axios@^1.18.1, class-variance-authority@^0.7.1, clsx@^2.1.1, date-fns@^4.4.0, framer-motion@^12.42.2, @hookform/resolvers@^5.4.0 (+61 more)

### Community 6 - "Reception and attendance workflows"
Cohesion: 0.07
Nodes (57): CheckInsPage(), handleCheckout(), handleVoid(), currentTimeInput(), errorMessage(), isToday(), resolveName(), STATUS_FILTERS (+49 more)

### Community 7 - "Authentication and role enforcement"
Cohesion: 0.08
Nodes (27): check_login_rate_limit(), create_access_token(), create_refresh_token(), decode_token(), generate_reset_token(), get_client_ip(), get_current_user(), get_optional_user() (+19 more)

### Community 8 - "API schema validation"
Cohesion: 0.06
Nodes (31): CheckIn, check_in(), check_out(), check_out_post(), list_checkins(), qr_check_in(), void_check_in(), AdminUserCreate (+23 more)

### Community 9 - "Notifications and profile state"
Cohesion: 0.07
Nodes (49): audienceLabel(), BroadcastPage(), loadHistory(), Mode, modeLabels, modeOptions, SentLogEntry, targetOptions (+41 more)

### Community 10 - "Development demo fixtures"
Cohesion: 0.07
Nodes (41): ATTENDANCE_BY_WEEKDAY, CHECK_INS_BY_HOUR, clamp(), createAthleteActivity(), createAttendanceTrend(), createMockNotifications(), createMockPrograms(), createPeakHours() (+33 more)

### Community 11 - "Full stack audit evidence"
Cohesion: 0.04
Nodes (49): Alembic temporary-database lifecycle, Atomic account and real form saves, Atomic identity validation, Audit scope and evidence boundary, Coach program workflow, Coach roster goals and messages, Cross-database FK migration work, Current browser landmarks tests (+41 more)

### Community 12 - "Motion and activity capsules"
Cohesion: 0.06
Nodes (44): Meter(), MeterProps, toneMap, Pressable, PressableProps, roundedMap, Shimmer, ShimmerProps (+36 more)

### Community 13 - "Monorepo workspace commands"
Cohesion: 0.05
Nodes (49): dependencies, @hookform/resolvers@^5.4.0, @radix-ui/react-avatar@^1.2.4, @radix-ui/react-checkbox@^1.3.9, @radix-ui/react-dialog@^1.1.21, @radix-ui/react-dropdown-menu@^2.1.22, @radix-ui/react-label@^2.1.13, @radix-ui/react-popover@^1.1.21 (+41 more)

### Community 14 - "Athlete detail coaching workflows"
Cohesion: 0.11
Nodes (39): CoachProfilePage(), InfoRow(), FreezeSheet(), MembershipFormSheet(), useUnfreezeMembershipAction(), NewPaymentSheet(), InfoRow(), MemberProfilePage() (+31 more)

### Community 15 - "Analytics chart rendering"
Cohesion: 0.08
Nodes (45): AthleteActivityChart(), AthleteActivityChartLazy, AthleteActivityChartProps, AthleteProgressChart(), AthleteProgressChartLazy, AthleteProgressChartProps, AttendanceTrendChart(), AttendanceTrendChartLazy (+37 more)

### Community 16 - "Shared design system"
Cohesion: 0.05
Nodes (39): Activity ring and actions demo, Category and workout row demo, Copied semantic palette, Dark and light comparison panes, Dual Theme Design Preview, Stats and personal accent demo, Theme palette swatches, Weekly pill track demo (+31 more)

### Community 17 - "Web testing dependencies"
Cohesion: 0.07
Nodes (26): @testing-library/jest-dom@^7.0.0, @testing-library/react@^16.3.2, @testing-library/user-event@^14.6.1, member, mocks, mocks, mocks, ControlledRow() (+18 more)

### Community 18 - "Shared API data types"
Cohesion: 0.08
Nodes (30): NewUserFormProps, DirectoryColumn, UserDirectoryProps, CloneProgramSheetProps, AuthContextType, AuthResponse, api, API_BASE_URL (+22 more)

### Community 19 - "Backend Fixes tests"
Cohesion: 0.07
Nodes (28): _shift_months(), _authz(), _clear_rate_limits(), client(), _email(), _ensure_checked_out(), ids(), _login() (+20 more)

### Community 20 - "Security tests"
Cohesion: 0.08
Nodes (21): _authz(), _branch_id(), _clear_rate_limits(), client(), _email(), ids(), _login(), _pin_rate_limit() (+13 more)

### Community 21 - "Role navigation and authorization"
Cohesion: 0.12
Nodes (23): adminDockItems, adminNavItems, p, AdminLayout(), athleteDockItems, athleteNavItems, iconProps, AthleteLayout() (+15 more)

### Community 22 - "Response and account routing"
Cohesion: 0.13
Nodes (20): Branch, success_response(), profile(), create_branch(), delete_branch(), get_branch(), list_branches(), update_branch() (+12 more)

### Community 23 - "Authz Fixes tests"
Cohesion: 0.10
Nodes (26): _authz(), _clear_rate_limits(), client(), _complete(), _email(), goals(), ids(), _admin_create() (+18 more)

### Community 24 - "Database and readiness models"
Cohesion: 0.10
Nodes (11): get_db(), DailyReadiness, _utcnow_naive(), get_readiness(), readiness_history(), ReadinessInput, save_readiness(), today() (+3 more)

### Community 25 - "HTTP application error handling"
Cohesion: 0.11
Nodes (16): health(), lifespan(), root(), Exercise, _encode(), log_exception(), paginated_response(), create_exercise() (+8 more)

### Community 26 - "Conversation participant access"
Cohesion: 0.20
Nodes (21): Conversation, Message, User, _conversation_payload(), create_conversation(), get_conversation(), _is_participant(), _last_message() (+13 more)

### Community 27 - "Continuous integration verification"
Cohesion: 0.08
Nodes (31): env, runs-on, steps, runs-on, steps, DATABASE_URL, E2E_PYTHON, SECRET_KEY (+23 more)

### Community 29 - "Portal dashboard metrics"
Cohesion: 0.16
Nodes (18): Goal, athlete_dashboard(), coach_dashboard(), _compute_streaks(), dashboard_stats(), _program_to_dict(), revenue_data(), _utcnow_naive() (+10 more)

### Community 30 - "Historical engineering decisions"
Cohesion: 0.06
Nodes (21): Accent theme inversion, Calm meditation visual language, Canonical monorepo unification, Daily revenue and explicit checkout, Dated Final Engineering Report, Dated Lighthouse improvements, Deliberate capability omissions, Dense analytics series (+13 more)

### Community 31 - "Nav.Spec browser tests"
Cohesion: 0.10
Nodes (9): PORTALS, PORTALS, api, signIn(), HERO_PAGES, PUBLIC_ROUTES, AA_PAIRS, PORT (+1 more)

### Community 32 - "Formatting and athlete goals"
Cohesion: 0.10
Nodes (18): categoryLabels, GoalsPage(), ActivityRings(), ActivityRingsProps, PopoverContent, Separator, TooltipContent, useGoals() (+10 more)

### Community 33 - "Financial record persistence"
Cohesion: 0.11
Nodes (11): Payment, create_payment(), get_payment(), list_payments(), update_payment(), update_payment_status(), PaymentCreate, PaymentResponse (+3 more)

### Community 34 - "Project operations guidance"
Cohesion: 0.07
Nodes (27): Activity capsule chart, Admin renewal approval, Alembic migrations available, AuthProvider and RequireAuth, Backend environment contracts, Build-time public configuration, Calm dual-theme design, Coach program and blueprint operations (+19 more)

### Community 35 - "Session caches and analytics"
Cohesion: 0.12
Nodes (22): AuthContext, RegisterData, StoreKind, loadMockService(), MockService, mockService, MockServiceKeys, Q (+14 more)

### Community 36 - "Web build dependencies"
Cohesion: 0.07
Nodes (27): devDependencies, autoprefixer@^10.5.4, eslint@^10.8.1, eslint-config-next@^16.3.8, @eslint/eslintrc@^3.2.0, jsdom@^29.1.1, @playwright/test@^1.63.0, postcss@^8.5.22 (+19 more)

### Community 37 - "Identity and message mutations"
Cohesion: 0.15
Nodes (21): currentUserId(), requireUserId(), applyGoalProgress(), invalidateMembership(), markExercise(), useChangePassword(), useCreateMembership(), useProfile() (+13 more)

### Community 38 - "Program prescription persistence"
Cohesion: 0.21
Nodes (20): ProgramExercise, TrainingProgram, add_exercise_to_program(), complete_exercise(), create_program(), delete_program(), get_program(), list_programs() (+12 more)

### Community 39 - "Live project handoff"
Cohesion: 0.08
Nodes (11): Current panel completion, Current validation totals, Historical deployment hardening, Historical rendering limitations, Independent xfail and migration warnings, Live Project State November 6, Management and coach completion objective, Production prerequisites (+3 more)

### Community 40 - "Workout and notification state"
Cohesion: 0.23
Nodes (19): ConfirmDialog(), ConfirmDialogProps, getRelativeTime(), NotificationsPage(), typeIcons, ConfirmDialog(), ConfirmDialogProps, readRestSoundPreference() (+11 more)

### Community 41 - "Membership approval lifecycle"
Cohesion: 0.22
Nodes (14): Membership, error_response(), create_membership(), deduct_session(), freeze_membership(), get_membership(), list_memberships(), renew_membership() (+6 more)

### Community 42 - "Landing page composition"
Cohesion: 0.19
Nodes (17): RootError(), NotFound(), metadata, OfflinePage(), FeaturesSection(), HeroSection(), HomePage(), LandingNavigation() (+9 more)

### Community 43 - "TypeScript workspace configuration"
Cohesion: 0.08
Nodes (24): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+16 more)

### Community 44 - "API contract regression tests"
Cohesion: 0.09
Nodes (4): _iso(), test_goal_delete_rejects_unrelated_athlete(), test_goal_update_and_delete(), test_membership_plan_soft_delete_when_referenced()

### Community 45 - "Account form validation"
Cohesion: 0.12
Nodes (20): formatDateInput(), IdentityFormData, identitySchema, newPasswordField, NewUserFormData, newUserSchema, NOTIFICATION_TYPE_LABEL, NOTIFICATION_TYPE_OPTIONS (+12 more)

### Community 46 - "Operational analytics queries"
Cohesion: 0.18
Nodes (15): athlete_activity(), attendance_trend(), _day_buckets(), _day_window(), membership_distribution(), _month_buckets(), _month_window(), peak_hours() (+7 more)

### Community 47 - "Validated onboarding forms"
Cohesion: 0.14
Nodes (19): ForgotFormData, ForgotPasswordPage(), requestLink(), forgotSchema, experienceLabels, goalLabels, OnboardingFormData, OnboardingPage() (+11 more)

### Community 48 - "Portal notification badges"
Cohesion: 0.15
Nodes (16): AthleteShell(), DOCK_ICONS, DOCK_MAX, NavIconName, NavItem, partitionNav(), PortalBadgeCounts, usePortalBadgeCounts() (+8 more)

### Community 49 - "Agent synchronization tooling"
Cohesion: 0.15
Nodes (6): _origin_allowed(), test_explicit_origin_list_still_allowed(), test_foreign_origin_not_allowed_by_regex(), test_preview_origin_allowed_by_regex(), AgentSyncManager, main()

### Community 50 - "Analytics and branch tests"
Cohesion: 0.09
Nodes (23): _data(), test_athlete_activity(), test_attendance_trend(), test_branch_create_update_delete(), test_branch_delete_conflicts_when_populated(), test_conversation_participant_is_athlete_for_admin(), test_conversation_participant_is_other_party_for_coach(), test_create_conversation_from_coach_side() (+15 more)

### Community 51 - "Root providers and layout"
Cohesion: 0.13
Nodes (15): bodoni, estedad, estedadLatin, metadata, montserrat, RootLayout(), vazirmatn, viewport (+7 more)

### Community 52 - "Canonical UI layout principles"
Cohesion: 0.10
Nodes (19): Canonical grid layouts, Color hierarchy, Content sized badges, Contextual heading caps, Control geometry consistency, Design constraints, Design thinking, Elevation meaning (+11 more)

### Community 53 - "Account and navigation menus"
Cohesion: 0.21
Nodes (15): PaymentRowActions(), otherStatuses(), UserEditSheet(), UserRowActions(), UserRowActionsProps, Header(), HeaderProps, DropdownMenuCheckboxItem (+7 more)

### Community 54 - "Program cloning and dates"
Cohesion: 0.25
Nodes (19): GoalCreateSheet(), CloneFields(), CloneFormValues, CloneProgramSheet(), CloneProgramValues, cloneSchema, GoalFields(), ProgramDetailsFields() (+11 more)

### Community 55 - "Workout sound and animation"
Cohesion: 0.16
Nodes (8): Props, GymWorkoutPlayerModal(), Props, WorkoutPlayerExercise, WorkoutPlayerRoutine, SoundEngine, soundEngine, framer-motion

### Community 56 - "Exercise metadata and forms"
Cohesion: 0.11
Nodes (12): difficultyOptions, ExerciseFormProps, exerciseSchema, ExerciseSuggestions, toExerciseFormValues(), BadgeVariant, DIFFICULTIES, difficultyLabels (+4 more)

### Community 57 - "Development fixture seeding"
Cohesion: 0.26
Nodes (10): _attendance_plan(), _ensure(), _ensure_branch(), _ensure_exercise(), _ensure_plan(), _ensure_user(), _month_start(), _seed() (+2 more)

### Community 58 - "Optimistic mutation rollback"
Cohesion: 0.27
Nodes (14): patchItemQueries(), patchListQueries(), restoreQueries(), snapshotQueries(), CONTRACT_V2_METHODS, Row, useCompleteProgramExercise(), useDeleteNotification() (+6 more)

### Community 59 - "Membership plan permissions"
Cohesion: 0.24
Nodes (10): require_roles(), MembershipPlan, create_plan(), delete_plan(), get_plan(), list_plans(), update_plan(), MembershipPlanCreate (+2 more)

### Community 60 - "Notification persistence and roles"
Cohesion: 0.26
Nodes (10): Notification, broadcast_notification(), create_notification(), delete_notification(), list_notifications(), mark_all_as_read(), mark_as_read(), NotificationBroadcast (+2 more)

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

### Community 65 - "Newconversationsheet source relationships"
Cohesion: 0.20
Nodes (11): FormValues, NewConversationFields(), NewConversationSheet(), NewConversationSheetProps, schema, installFocusTracker(), takeRestoreTarget(), Sheet() (+3 more)

### Community 66 - "Chart theme integration"
Cohesion: 0.21
Nodes (11): chartSurface(), ChartTheme, FALLBACK, getServerSnapshot(), getSnapshot(), Listener, listeners, read() (+3 more)

### Community 67 - "Backend dependency versions"
Cohesion: 0.13
Nodes (15): alembic1.20.0, bcrypt4.0.1, cryptography50.0.0, FastAPI0.142.2, httpx0.28.1, passlib1.7.4, Pinned Backend Python Dependencies, Pydantic2.9.2 (+7 more)

### Community 69 - "Typography design principles"
Cohesion: 0.14
Nodes (12): Brand type voice, Display heading line height, Heading semantic and visual roles, Localization and RTL typography, Minimum font sizes, Modular type scale, Readability triad, Responsive fluid typography (+4 more)

### Community 70 - "Scroll reveal animation"
Cohesion: 0.16
Nodes (12): FadeInProps, FadeInScale(), hiddenTransform(), Reveal(), RevealDirection, RevealProps, ScrollReveal, StaggerContext (+4 more)

### Community 71 - "Backend architecture and operations"
Cohesion: 0.14
Nodes (14): Branch, CheckIn, Conversation, Exercise, FastAPI backend, Goal, Membership, MembershipPlan (+6 more)

### Community 72 - "Spacing and accessibility principles"
Cohesion: 0.15
Nodes (7): TypeUI Design Fundamentals, Heading paragraph spacing, Horizontal utility clusters, Responsive spacing, Spacing Principles, Spacing tiers, Vertical rhythm

### Community 73 - "Payment reconciliation controls"
Cohesion: 0.18
Nodes (12): ALL_STATUSES, EditPaymentFormData, editPaymentSchema, EditPaymentSheet(), NewPaymentFormData, newPaymentSchema, RISKY_STATUSES, toAmount() (+4 more)

### Community 74 - "Skeleton UI behavior"
Cohesion: 0.37
Nodes (8): AdminLoading(), AthleteLoading(), CoachLoading(), CardSkeleton(), ListSkeleton(), PageSkeleton(), Skeleton(), TableSkeleton()

### Community 75 - "Coaching goal editing"
Cohesion: 0.17
Nodes (10): GoalFormValues, GoalPatch, goalSchema, GoalSheet(), GoalSheetProps, statusOptions, BadgeVariant, GOAL_STATUSES (+2 more)

### Community 76 - "Authentication form validation"
Cohesion: 0.22
Nodes (10): mutationErrorMessage(), classifyResetFailure(), HttpErrorShape, httpStatusOf(), PASSWORD_HINT, PASSWORD_LENGTH_MESSAGE, PASSWORD_MIN_LENGTH, PASSWORD_PATTERN (+2 more)

### Community 77 - "Coach programs editing"
Cohesion: 0.29
Nodes (13): ProgramDetailPage(), confirmAction(), moveEntry(), saveDetails(), saveEntry(), saveOrders(), setStatus(), write() (+5 more)

### Community 78 - "Conversation access regression tests"
Cohesion: 0.15
Nodes (10): _conversation_of(), test_admin_can_read_any_conversation(), test_conversation_lists_are_paginated(), test_conversation_response_shape(), test_message_response_shape_and_ascending(), test_non_participant_cannot_touch_conversation(), test_non_participant_coach_cannot_read_conversation(), test_send_message_bumps_last_message_at() (+2 more)

### Community 79 - "Password reset lifecycle tests"
Cohesion: 0.15
Nodes (11): _register(), test_change_password_enforces_policy(), test_change_password_flow(), test_new_reset_request_invalidates_outstanding_token(), test_password_reset_end_to_end(), test_reset_token_is_single_use(), test_reset_token_stored_hashed_only(), test_update_profile() (+3 more)

### Community 80 - "Membership lifecycle regression tests"
Cohesion: 0.15
Nodes (9): test_admin_sets_password_without_the_current_one(), test_freeze_is_rejected_unless_the_membership_is_active(), test_membership_writes_are_staff_only(), test_password_set_enforces_the_policy_and_ownership(), test_self_service_password_still_needs_the_current_one(), test_user_status_patch(), test_user_status_patch_validation_and_role_gate(), _throwaway_membership() (+1 more)

### Community 81 - "Mobile dock navigation"
Cohesion: 0.26
Nodes (10): AthleteNavIcon(), CheckinNavIcon(), HomeNavIcon(), IconProps, ProgressNavIcon(), WorkoutNavIcon(), DockIconKind, DockNav() (+2 more)

### Community 83 - "Conftest tests"
Cohesion: 0.26
Nodes (6): _auth(), client(), _isolate_rate_limiter(), _login(), seeded(), tokens()

### Community 85 - "Accessible interaction principles"
Cohesion: 0.18
Nodes (10): Accessible state semantics, Button feedback timing, Error recovery state, Hover and active technique palettes, Interaction and Control Principles, Navigation link treatment, Nine-state button contract, Orthogonal button type style state (+2 more)

### Community 86 - "Auth login workflows"
Cohesion: 0.29
Nodes (9): DemoAccount, LoginPage(), MOCK_DEMO_ACCOUNTS, SEED_DEMO_ACCOUNTS, SignInContent(), StaggerContainer(), StaggerItem(), StaggerItemProps (+1 more)

### Community 87 - "Membership payment presentation"
Cohesion: 0.22
Nodes (7): FreezeSheetProps, MembershipFormSheetProps, membershipStatusConfig, paymentStatusConfig, Membership, MembershipInput, Payment

### Community 88 - "Exercise prescription data types"
Cohesion: 0.24
Nodes (6): WorkoutExerciseRowProps, ProgramExerciseRowProps, ProgramExerciseSheetProps, Exercise, ProgramExercise, ProgramExerciseInput

### Community 89 - "Exercise prescription editing"
Cohesion: 0.22
Nodes (8): dayOptions, DraftFormValues, draftSchema, FieldsProps, ProgramExerciseDraft, ProgramExerciseFields(), ProgramExerciseSheet(), WEEK_DAYS

### Community 90 - "Membership Approval tests"
Cohesion: 0.38
Nodes (9): own_membership(), test_admin_approval_persists_and_rejects_shortening_the_term(), test_admin_membership_edit_persists_the_fields_the_form_offers(), test_athlete_cannot_grant_themselves_a_new_term(), test_inconsistent_membership_price_edit_is_rejected_atomically(), test_reception_cannot_approve_a_renewal(), test_reception_cannot_bypass_approval_by_creating_another_term(), test_reception_cannot_bypass_approval_through_generic_edit() (+1 more)

### Community 91 - "Web workspace commands"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, start, test, test:e2e, test:e2e:real (+1 more)

### Community 92 - "Auth register workflows"
Cohesion: 0.31
Nodes (8): branchSchema, Field(), RegisterFormData, RegisterPage(), registerSchema, homeForRole(), profileSchema, validateIranianPhone()

### Community 93 - "Program metadata editing"
Cohesion: 0.22
Nodes (8): DetailsFormValues, detailsSchema, frequencyOptions, ProgramDetailsPatch, ProgramDetailsSheet(), ProgramDetailsSheetProps, statusOptions, PROGRAM_STATUSES

### Community 94 - "QR attendance entry"
Cohesion: 0.33
Nodes (8): BarcodeDetectorCtor, BarcodeDetectorInstance, cameraAvailable(), DetectedBarcode, getDetectorCtor(), QrEntry(), startScan(), QrEntryProps

### Community 95 - "Agent session history"
Cohesion: 0.25
Nodes (7): Multi-Agent Session History, November 1 capsule and rename session, November 1 deployment hardening session, November 6 fullstack completion session, November 6 validation totals, Preserved unrelated working-tree changes, Production rollout remains pending

### Community 96 - "Portal error recovery views"
Cohesion: 0.46
Nodes (4): AdminError(), AthleteError(), CoachError(), PortalErrorView()

### Community 97 - "Animated metric tiles"
Cohesion: 0.36
Nodes (6): AnimatedCounter(), AnimatedCounterProps, DeltaChip(), StatTile(), StatTileProps, toneMap

### Community 98 - "Privileged Account Edits tests"
Cohesion: 0.36
Nodes (4): test_admin_identity_edits_reject_invalid_values_atomically(), test_null_profile_fields_are_rejected_before_corrupting_an_account(), test_reception_cannot_create_privileged_accounts(), test_reception_cannot_edit_privileged_login_identity()

### Community 99 - "Agent coordination protocol"
Cohesion: 0.29
Nodes (6): Atomic context commit, Cairn tool ownership, Live state and Cairn plan, Multi-Agent Sync Protocol v2, Session lock, Claude Native Adapter

### Community 101 - "Jalali attendance calendar"
Cohesion: 0.48
Nodes (5): date-fns-jalali@^4.4.0-0, getJalaliMonth(), groupCheckinsByJalaliDay(), moveJalaliMonth(), date-fns-jalali

### Community 102 - "Historical fitness design direction"
Cohesion: 0.29
Nodes (7): Activity Rings, Apple HIG and iOS18 reference, Fitness mapping, Historical Apple Fitness Design Direction, SF Pro and Vazirmatn scale, Six step design plan, Translucent tab bar and sticky title

### Community 104 - "Athlete goal data contracts"
Cohesion: 0.29
Nodes (6): GOAL_CATEGORIES, goalCategoryIndicator, goalCategoryLabels, goalStatusConfig, GoalCreatePatch, Goal

### Community 106 - "Reserved shared package planning"
Cohesion: 0.33
Nodes (5): Planned API client package, Planned config package, Planned UI package, Reserved Shared Turbo Workspaces, Shared workspaces empty by design

### Community 107 - "Persistent portal messages"
Cohesion: 0.60
Nodes (3): Page(), Page(), MessagesPage()

### Community 108 - "Offline recovery controls"
Cohesion: 0.70
Nodes (4): getOnlineServerSnapshot(), getOnlineSnapshot(), OfflineRetry(), subscribeOnline()

### Community 109 - "Activity history portrait screenshot"
Cohesion: 0.50
Nodes (4): Active-day capsule display, Activity history portrait screenshot, Attendance duration table, Floating dock navigation

### Community 110 - "Lumi portrait landing screenshot"
Cohesion: 0.50
Nodes (4): Landing action buttons, Lumi wordmark, Portrait Lumi landing screenshot, Women gym platform hero

### Community 111 - "Antigravity synchronization protocol"
Cohesion: 0.50
Nodes (4): Agent lock protocol, Antigravity Agent Sync Rules, Atomic session handoff, Cairn checkpoints

### Community 112 - "Desktop Lumi landing screenshot"
Cohesion: 0.50
Nodes (4): Activity ring preview, Desktop hero layout, Desktop Lumi landing screenshot, PWA install banner

### Community 113 - "Installed Next.js contributor guidance"
Cohesion: 0.50
Nodes (3): Installed Next.js documentation, Next.js Generated Agent Rules, Web Claude Adapter

### Community 116 - "Membership plan form validation"
Cohesion: 0.83
Nodes (4): onSubmit(), planSchema, toAmount(), toLatinDigits()

### Community 119 - "Playfair Display license obligations"
Cohesion: 0.67
Nodes (4): Playfair Display, Playfair Display Font License, Reserved Font Name Playfair Display, SIL Open Font License1.1

### Community 120 - "Vercel build configuration"
Cohesion: 0.50
Nodes (3): buildCommand, framework, $schema

### Community 123 - "Light activity capsule screenshot"
Cohesion: 0.67
Nodes (3): Activity readout and table, Capsule chart light screenshot, Rose capsule chart

### Community 124 - "Activity capsule hover screenshot"
Cohesion: 0.67
Nodes (3): Capsule chart hover screenshot, Dark pink capsule chart, Hover duration tooltip

### Community 125 - "Dark activity capsule screenshot"
Cohesion: 0.67
Nodes (3): Capsule chart dark screenshot, Dark activity capsule state, Persian activity summary

### Community 127 - "Peach Lumi logo identity"
Cohesion: 0.67
Nodes (3): Peach brand palette, Peach Lumi Wellness logo, Serif and sans brand pairing

### Community 128 - "Transparent Lumi logo identity"
Cohesion: 0.67
Nodes (3): Serif and sans brand pairing, Transparent Lumi Wellness logo, Transparent wordmark composition

### Community 129 - "White Lumi logo identity"
Cohesion: 0.67
Nodes (3): Serif and sans brand pairing, White background Lumi Wellness logo, White brand presentation

### Community 130 - "Lumi social preview identity"
Cohesion: 0.67
Nodes (3): Lumi Wellness social preview, Smart gym management brand, Soft pink social composition

### Community 132 - "Vazirmatn font license obligations"
Cohesion: 1.00
Nodes (3): SIL Open Font License1.1, Vazirmatn, Vazirmatn Font License

### Community 133 - "Jakarta Sans license obligations"
Cohesion: 1.00
Nodes (3): Plus Jakarta Sans, Plus Jakarta Sans Font License, SIL Open Font License1.1

## Knowledge Gaps
- **409 isolated node(s):** `WCAG 2.1 and 2.2 AA`, `Text contrast thresholds`, `Non-text contrast`, `Focus visibility`, `Keyboard navigation` (+404 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1202 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **51 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Portal actions and controls` to `Shared portal UI primitives`, `Membership editing forms`, ` Use Target source relationships`, `Web runtime dependencies`, `Reception and attendance workflows`, `Scenicbackground UI behavior`, `Sceniccoursebackground UI behavior`, `Notifications and profile state`, `Motion and activity capsules`, `Athlete detail coaching workflows`, `Analytics chart rendering`, `Web testing dependencies`, `Role navigation and authorization`, `Formatting and athlete goals`, `Session caches and analytics`, `Identity and message mutations`, `Workout and notification state`, `Landing page composition`, `Account form validation`, `Validated onboarding forms`, `Portal notification badges`, `Root providers and layout`, `Account and navigation menus`, `Program cloning and dates`, `Workout sound and animation`, `Exercise metadata and forms`, `Newconversationsheet source relationships`, `Chart theme integration`, `Scroll reveal animation`, `Payment reconciliation controls`, `Mobile dock navigation`, `Auth login workflows`, `Exercise prescription data types`, `Exercise prescription editing`, `Auth register workflows`, `Program metadata editing`, `QR attendance entry`, `Portal error recovery views`, `Animated metric tiles`, `Offline recovery controls`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Are the 102 inferred relationships involving `User` (e.g. with `get_current_user()` and `get_optional_user()`) actually correct?**
  _`User` has 102 INFERRED edges - model-reasoned connections that need verification._
- **What connects `WCAG 2.1 and 2.2 AA`, `Text contrast thresholds`, `Non-text contrast` to the rest of the system?**
  _409 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API contract and privileges` be split into smaller, more focused modules?**
  _Cohesion score 0.015503875968992248 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Portal actions and controls` to `Shared portal UI primitives`, `Membership editing forms`, `Web runtime dependencies`, `Reception and attendance workflows`, `Notifications and profile state`, `Motion and activity capsules`, `Athlete detail coaching workflows`, `Role navigation and authorization`, `Formatting and athlete goals`, `Workout and notification state`, `Landing page composition`, `Account form validation`, `Validated onboarding forms`, `Portal notification badges`, `Account and navigation menus`, `Workout sound and animation`, `Exercise metadata and forms`, `Newconversationsheet source relationships`, `Payment reconciliation controls`, `Mobile dock navigation`, `Auth login workflows`, `Exercise prescription data types`, `Auth register workflows`, `QR attendance entry`, `Portal error recovery views`, `Animated metric tiles`, `Offline recovery controls`, `Not Found source relationships`, `Not Found source relationships`, `Not Found source relationships`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `Portal actions and controls` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `Shared portal UI primitives` to `Portal actions and controls`, `Membership editing forms`, `Reception and attendance workflows`, `Notifications and profile state`, `Motion and activity capsules`, `Athlete detail coaching workflows`, `Analytics chart rendering`, `Web testing dependencies`, `Role navigation and authorization`, `Formatting and athlete goals`, `Workout and notification state`, `Landing page composition`, `Portal notification badges`, `Account and navigation menus`, `Program cloning and dates`, `Newconversationsheet source relationships`, `Skeleton UI behavior`, `Mobile dock navigation`, `Exercise prescription data types`, `Animated metric tiles`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
## Index provenance and limits
This is a working-tree snapshot based on e911fa2fee0ddf5220b52004d2b9a5492f9402e1. Match current source with provenance.json file hashes. Historical document claims are not evidence of current runtime behavior. The initial snapshot is preserved locally in initial-snapshot/.

Graph health warnings are recorded in graph-health.json: dangling endpoints, self-loops and same-endpoint relations collapsed in the undirected graph. Use source checks for unresolved or inferred relationships. AST coverage includes 17 code files modeled only at file level; backend/pyproject.toml failed extraction and skills-lock.json was deliberately skipped. See provenance.json for exact files.

The graphify-out/ working-tree output is shared in Git selectively; caches and the initial snapshot stay local. Token totals are compatibility placeholders, not measured zero usage.
