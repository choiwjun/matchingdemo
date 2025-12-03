// Service Categories - Japanese (日本語)
export const CATEGORIES = [
    { id: 'construction', name: 'Construction', nameKo: '建設・リフォーム', icon: '🏗️' },
    { id: 'cleaning', name: 'Cleaning', nameKo: '清掃・整理', icon: '🧹' },
    { id: 'moving', name: 'Moving', nameKo: '引越し・運送', icon: '🚚' },
    { id: 'repair', name: 'Repair', nameKo: '修理・設置', icon: '🔧' },
    { id: 'design', name: 'Design', nameKo: 'デザイン', icon: '🎨' },
    { id: 'education', name: 'Education', nameKo: '教育・レッスン', icon: '📚' },
    { id: 'health', name: 'Health', nameKo: '健康・美容', icon: '💆' },
    { id: 'it', name: 'IT Services', nameKo: 'IT・技術', icon: '💻' },
    { id: 'event', name: 'Event', nameKo: 'イベント・行事', icon: '🎉' },
    { id: 'legal', name: 'Legal', nameKo: '法律・税務', icon: '⚖️' },
    { id: 'pet', name: 'Pet Services', nameKo: 'ペット', icon: '🐕' },
    { id: 'other', name: 'Other', nameKo: 'その他', icon: '📦' },
];

// Japanese Regions (日本の地域)
export const REGIONS = [
    { id: 'tokyo', name: '東京都' },
    { id: 'osaka', name: '大阪府' },
    { id: 'kanagawa', name: '神奈川県' },
    { id: 'aichi', name: '愛知県' },
    { id: 'saitama', name: '埼玉県' },
    { id: 'chiba', name: '千葉県' },
    { id: 'hyogo', name: '兵庫県' },
    { id: 'hokkaido', name: '北海道' },
    { id: 'fukuoka', name: '福岡県' },
    { id: 'kyoto', name: '京都府' },
    { id: 'shizuoka', name: '静岡県' },
    { id: 'hiroshima', name: '広島県' },
    { id: 'ibaraki', name: '茨城県' },
    { id: 'miyagi', name: '宮城県' },
    { id: 'niigata', name: '新潟県' },
    { id: 'nagano', name: '長野県' },
    { id: 'okinawa', name: '沖縄県' },
];

// Budget Ranges (予算範囲)
export const BUDGET_RANGES = [
    { id: 'under-100k', label: '10万円未満', min: 0, max: 100000 },
    { id: '100k-500k', label: '10万円〜50万円', min: 100000, max: 500000 },
    { id: '500k-1m', label: '50万円〜100万円', min: 500000, max: 1000000 },
    { id: '1m-5m', label: '100万円〜500万円', min: 1000000, max: 5000000 },
    { id: '5m-10m', label: '500万円〜1,000万円', min: 5000000, max: 10000000 },
    { id: 'over-10m', label: '1,000万円以上', min: 10000000, max: null },
];

// Project Status Labels (案件ステータス)
export const PROJECT_STATUS_LABELS = {
    OPEN: { label: '募集中', color: 'bg-green-100 text-green-800' },
    IN_PROGRESS: { label: '進行中', color: 'bg-blue-100 text-blue-800' },
    COMPLETED: { label: '完了', color: 'bg-gray-100 text-gray-800' },
    CANCELLED: { label: 'キャンセル', color: 'bg-red-100 text-red-800' },
};

// Contract Status Labels (契約ステータス)
export const CONTRACT_STATUS_LABELS = {
    PENDING: { label: '承認待ち', color: 'bg-yellow-100 text-yellow-800' },
    ACTIVE: { label: '進行中', color: 'bg-blue-100 text-blue-800' },
    COMPLETED: { label: '完了', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'キャンセル', color: 'bg-red-100 text-red-800' },
};

// Proposal Status Labels (提案ステータス)
export const PROPOSAL_STATUS_LABELS = {
    PENDING: { label: '審査中', color: 'bg-yellow-100 text-yellow-800' },
    ACCEPTED: { label: '承認済み', color: 'bg-green-100 text-green-800' },
    REJECTED: { label: 'お見送り', color: 'bg-red-100 text-red-800' },
    WITHDRAWN: { label: '取り下げ', color: 'bg-gray-100 text-gray-800' },
};

// Payment Methods (お支払い方法)
export const PAYMENT_METHODS = [
    { id: 'card', name: 'クレジットカード', icon: '💳' },
    { id: 'bank', name: '銀行振込', icon: '🏦' },
    { id: 'paypay', name: 'PayPay', icon: '💛' },
    { id: 'linepay', name: 'LINE Pay', icon: '💚' },
    { id: 'rakutenpay', name: '楽天ペイ', icon: '💙' },
];

// Platform Fee Rate (プラットフォーム手数料率)
export const PLATFORM_FEE_RATE = 0.1; // 10%

// File Upload Limits (ファイルアップロード制限)
export const FILE_LIMITS = {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImages: 10,
    maxFiles: 5,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedFileTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Notification Types Labels (通知タイプ)
export const NOTIFICATION_TYPE_LABELS = {
    NEW_PROPOSAL: { label: '新しい提案', icon: '📝', color: 'text-blue-600' },
    NEW_MESSAGE: { label: '新着メッセージ', icon: '💬', color: 'text-green-600' },
    CONTRACT_CONFIRMED: { label: '契約確定', icon: '✅', color: 'text-primary-600' },
    CONTRACT_COMPLETED: { label: '契約完了', icon: '🎉', color: 'text-purple-600' },
    REVIEW_REQUEST: { label: 'レビュー依頼', icon: '⭐', color: 'text-yellow-600' },
    PAYMENT_COMPLETED: { label: 'お支払い完了', icon: '💰', color: 'text-green-600' },
    SYSTEM: { label: 'システム', icon: '🔔', color: 'text-gray-600' },
};

// Sort Options (並び替えオプション)
export const SORT_OPTIONS = {
    projects: [
        { id: 'createdAt-desc', label: '新着順' },
        { id: 'createdAt-asc', label: '投稿日が古い順' },
        { id: 'budget-desc', label: '予算が高い順' },
        { id: 'budget-asc', label: '予算が低い順' },
        { id: 'deadline-asc', label: '締切が近い順' },
    ],
    proposals: [
        { id: 'createdAt-desc', label: '新着順' },
        { id: 'amount-asc', label: '金額が低い順' },
        { id: 'amount-desc', label: '金額が高い順' },
        { id: 'rating-desc', label: '評価が高い順' },
    ],
};
