// 日付をフォマード
export function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat('ja-JP').format(new Date(date))
}