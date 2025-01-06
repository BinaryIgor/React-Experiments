export function hasAnyContent(str: string | null | undefined): boolean {
    return str && str as any && str.trim().length > 0;
}

export function hasLength(str: string | null | undefined, min: number, max: number): boolean {
    return str && str as any && str.length >= min && str.length <= max;
}