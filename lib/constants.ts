// Service Categories
export const CATEGORIES = [
    { id: 'construction', name: 'Construction', nameKo: '건설/인테리어', icon: '🏗️' },
    { id: 'cleaning', name: 'Cleaning', nameKo: '청소/정리', icon: '🧹' },
    { id: 'moving', name: 'Moving', nameKo: '이사/운송', icon: '🚚' },
    { id: 'repair', name: 'Repair', nameKo: '수리/설치', icon: '🔧' },
    { id: 'design', name: 'Design', nameKo: '디자인', icon: '🎨' },
    { id: 'education', name: 'Education', nameKo: '교육/레슨', icon: '📚' },
    { id: 'health', name: 'Health', nameKo: '건강/뷰티', icon: '💆' },
    { id: 'it', name: 'IT Services', nameKo: 'IT/기술', icon: '💻' },
    { id: 'event', name: 'Event', nameKo: '이벤트/행사', icon: '🎉' },
    { id: 'legal', name: 'Legal', nameKo: '법률/세무', icon: '⚖️' },
    { id: 'pet', name: 'Pet Services', nameKo: '반려동물', icon: '🐕' },
    { id: 'other', name: 'Other', nameKo: '기타', icon: '📦' },
];

// Korean Regions
export const REGIONS = [
    { id: 'seoul', name: '서울특별시' },
    { id: 'busan', name: '부산광역시' },
    { id: 'daegu', name: '대구광역시' },
    { id: 'incheon', name: '인천광역시' },
    { id: 'gwangju', name: '광주광역시' },
    { id: 'daejeon', name: '대전광역시' },
    { id: 'ulsan', name: '울산광역시' },
    { id: 'sejong', name: '세종특별자치시' },
    { id: 'gyeonggi', name: '경기도' },
    { id: 'gangwon', name: '강원도' },
    { id: 'chungbuk', name: '충청북도' },
    { id: 'chungnam', name: '충청남도' },
    { id: 'jeonbuk', name: '전라북도' },
    { id: 'jeonnam', name: '전라남도' },
    { id: 'gyeongbuk', name: '경상북도' },
    { id: 'gyeongnam', name: '경상남도' },
    { id: 'jeju', name: '제주특별자치도' },
];

// Budget Ranges
export const BUDGET_RANGES = [
    { id: 'under-100k', label: '10만원 미만', min: 0, max: 100000 },
    { id: '100k-500k', label: '10만원 ~ 50만원', min: 100000, max: 500000 },
    { id: '500k-1m', label: '50만원 ~ 100만원', min: 500000, max: 1000000 },
    { id: '1m-5m', label: '100만원 ~ 500만원', min: 1000000, max: 5000000 },
    { id: '5m-10m', label: '500만원 ~ 1000만원', min: 5000000, max: 10000000 },
    { id: 'over-10m', label: '1000만원 이상', min: 10000000, max: null },
];

// Project Status Labels
export const PROJECT_STATUS_LABELS = {
    OPEN: { label: '모집중', color: 'bg-green-100 text-green-800' },
    IN_PROGRESS: { label: '진행중', color: 'bg-blue-100 text-blue-800' },
    COMPLETED: { label: '완료', color: 'bg-gray-100 text-gray-800' },
    CANCELLED: { label: '취소됨', color: 'bg-red-100 text-red-800' },
};

// Contract Status Labels
export const CONTRACT_STATUS_LABELS = {
    PENDING: { label: '대기중', color: 'bg-yellow-100 text-yellow-800' },
    ACTIVE: { label: '진행중', color: 'bg-blue-100 text-blue-800' },
    COMPLETED: { label: '완료', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: '취소됨', color: 'bg-red-100 text-red-800' },
};

// Proposal Status Labels
export const PROPOSAL_STATUS_LABELS = {
    PENDING: { label: '검토중', color: 'bg-yellow-100 text-yellow-800' },
    ACCEPTED: { label: '수락됨', color: 'bg-green-100 text-green-800' },
    REJECTED: { label: '거절됨', color: 'bg-red-100 text-red-800' },
    WITHDRAWN: { label: '철회됨', color: 'bg-gray-100 text-gray-800' },
};

// Payment Methods
export const PAYMENT_METHODS = [
    { id: 'card', name: '신용/체크카드', icon: '💳' },
    { id: 'bank', name: '계좌이체', icon: '🏦' },
    { id: 'kakao', name: '카카오페이', icon: '💛' },
    { id: 'naver', name: '네이버페이', icon: '💚' },
    { id: 'toss', name: '토스', icon: '💙' },
];

// Platform Fee Rate
export const PLATFORM_FEE_RATE = 0.1; // 10%

// File Upload Limits
export const FILE_LIMITS = {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImages: 10,
    maxFiles: 5,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedFileTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Notification Types Labels
export const NOTIFICATION_TYPE_LABELS = {
    NEW_PROPOSAL: { label: '새 제안', icon: '📝', color: 'text-blue-600' },
    NEW_MESSAGE: { label: '새 메시지', icon: '💬', color: 'text-green-600' },
    CONTRACT_CONFIRMED: { label: '계약 확정', icon: '✅', color: 'text-primary-600' },
    CONTRACT_COMPLETED: { label: '계약 완료', icon: '🎉', color: 'text-purple-600' },
    REVIEW_REQUEST: { label: '리뷰 요청', icon: '⭐', color: 'text-yellow-600' },
    PAYMENT_COMPLETED: { label: '결제 완료', icon: '💰', color: 'text-green-600' },
    SYSTEM: { label: '시스템', icon: '🔔', color: 'text-gray-600' },
};

// Sort Options
export const SORT_OPTIONS = {
    projects: [
        { id: 'createdAt-desc', label: '최신순' },
        { id: 'createdAt-asc', label: '오래된순' },
        { id: 'budget-desc', label: '예산 높은순' },
        { id: 'budget-asc', label: '예산 낮은순' },
        { id: 'deadline-asc', label: '마감 임박순' },
    ],
    proposals: [
        { id: 'createdAt-desc', label: '최신순' },
        { id: 'amount-asc', label: '금액 낮은순' },
        { id: 'amount-desc', label: '금액 높은순' },
        { id: 'rating-desc', label: '평점 높은순' },
    ],
};
