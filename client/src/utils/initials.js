export function getInitials(firstName, lastName) {
    if (!firstName || !lastName) return '';
    const initials = [firstName[0], lastName[0]];
    return initials.map(initial => initial.toUpperCase()).join('');
}