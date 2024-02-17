export function metersToKilometers(visibilityInMeters: number) {
  const visibilityInKilometers = visibilityInMeters / 100;

  return `${visibilityInKilometers.toFixed()}km`;
}
