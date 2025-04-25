export function getInitials(firstName, lastName) {
    if (!firstName && !lastName) return '';
    if (firstName && !lastName) return firstName[0].toUpperCase();
    if (!firstName && lastName) return lastName[0].toUpperCase();
    const initials = [firstName[0], lastName[0]];
    return initials.map(initial => initial.toUpperCase()).join('');
}