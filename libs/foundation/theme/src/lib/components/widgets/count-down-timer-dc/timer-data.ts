export class timeComponents {
  secondsToDday: number;
  minutesToDday: number;
  hoursToDday: number;
  daysToDday: number;
}

export class TimerLabelList {
  public static get TIME_SEC() {
    return {
      key: 'SEC',
      label: {
        english: 'SEC',
        arabic: 'ثانية'
      }
    };
  }
  public static get TIME_MIN() {
    return {
      key: 'MIN',
      label: {
        english: 'MIN',
        arabic: 'دقيقة'
      }
    };
  }

  public static get TIME_HOURS() {
    return {
      key: 'HRS',
      label: {
        english: 'HOURS',
        arabic: 'الساعات'
      }
    };
  }
  public static get DAY_ONE() {
    return {
      key: 'DAY',
      label: {
        english: 'DAY',
        arabic: 'يوم'
      }
    };
  }
  public static get DAY_TWO() {
    return {
      key: 'DAYS',
      label: {
        english: 'DAYS',
        arabic: 'يومين'
      }
    };
  }
  public static get DAY_3_10() {
    return {
      key: 'DAY-3-10',
      label: {
        english: 'DAYS',
        arabic: 'أيام'
      }
    };
  }
  public static get DAY_ELEVEN() {
    return {
      key: 'DAY-11',
      label: {
        english: 'DAYS',
        arabic: 'يوم'
      }
    };
  }
  public static get DAY_ZERO() {
    return {
      key: 'DAY-0',
      label: {
        english: 'DAYS',
        arabic: 'يوم'
      }
    };
  }
}
