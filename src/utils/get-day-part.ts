import DayParts from '../enums/day-parts';

const getDayPart = (): string => {
  const date = new Date();
  const hours = date.getHours();
  const hour = Math.floor(hours / 6);
  switch (hour) {
    case 1:
      return DayParts.Morning;
    case 2:
      return DayParts.Afternoon;
    case 3:
      return DayParts.Evening;
    default:
      return DayParts.Night;
  }
};

export default getDayPart;
