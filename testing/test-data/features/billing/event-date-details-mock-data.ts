/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

export const eventDateDetailsMockData = {
  eventDateInfo: [
    {
      month: {
        english: 'January',
        arabic: ''
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2010-06-15T00:00:00.000Z'),
        hijiri: ''
      }
    },
    {
      month: {
        english: 'February',
        arabic: ''
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2010-06-15T00:00:00.000Z'),
        hijiri: ''
      }
    }
  ],

  workflow: null,
  fromJsonToObject: () => {
    return undefined;
  }
};

export const eventDateUpdateMock = {
  eventDateInfo: [
    {
      month: {
        arabic: 'يناير',
        english: 'January'
      },
      year: 2020,
      eventDate: {
        gregorian: '2020-02-18T00:00:00.000Z',
        hijiri: '1441-06-24'
      }
    }
  ],
  workflow: {
    referenceNo: '269380'
  }
};

export const eventDateListMock = {
  eventDateInfo: [
    {
      month: {
        arabic: 'يناير',
        english: 'January'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2020-02-18T00:00:00.000Z'),
        hijiri: '1441-06-24'
      }
    },
    {
      month: {
        arabic: 'فبراير',
        english: 'February'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2020-03-17T00:00:00.000Z'),
        hijiri: '1441-07-22'
      }
    },
    {
      month: {
        arabic: 'مارس',
        english: 'March'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2020-04-16T00:00:00.000Z'),
        hijiri: '1441-08-23'
      }
    },
    {
      month: {
        arabic: 'أبريل',
        english: 'April'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2020-05-17T00:00:00.000Z'),
        hijiri: '1441-09-24'
      }
    },
    {
      month: {
        arabic: 'مايو',
        english: 'May'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2020-06-17T00:00:00.000Z'),
        hijiri: '1441-10-25'
      }
    },
    {
      month: {
        arabic: 'يونيو',
        english: 'June'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2020-07-16T00:00:00.000Z'),
        hijiri: '1441-11-25'
      }
    },
    {
      month: {
        arabic: 'يوليو',
        english: 'July'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2020-08-17T00:00:00.000Z'),
        hijiri: '1441-12-27'
      }
    },
    {
      month: {
        arabic: 'أغسط',
        english: 'August'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2020-09-17T00:00:00.000Z'),
        hijiri: '1442-01-29'
      }
    },
    {
      month: {
        arabic: 'سبتمبر',
        english: 'September'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2020-10-17T00:00:00.000Z'),
        hijiri: '1442-02-30'
      }
    },
    {
      month: {
        arabic: 'أكتوبر',
        english: 'October'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2020-11-17T00:00:00.000Z'),
        hijiri: '1442-04-02'
      }
    },
    {
      month: {
        arabic: 'نوفمبر',
        english: 'November'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2020-12-16T00:00:00.000Z'),
        hijiri: '1442-05-01'
      }
    },
    {
      month: {
        arabic: 'ديسمبر',
        english: 'December'
      },
      year: 2020,
      eventDate: {
        gregorian: new Date('2021-01-17T00:00:00.000Z'),
        hijiri: '1442-06-04'
      }
    }
  ],
  year: 2020,
  workflow: 'test',
  fromJsonToObject: () => {
    return undefined;
  }
};

export const pendingEventDates = {
  eventDateInfo: [
    {
      month: {
        arabic: 'نوفمبر',
        english: 'November'
      },
      year: 2020,
      eventDate: {
        gregorian: '2020-12-16T00:00:00.000Z',
        hijiri: '1442-05-01'
      }
    },
    {
      month: {
        arabic: 'ديسمبر',
        english: 'December'
      },
      year: 2020,
      eventDate: {
        gregorian: '2021-01-17T00:00:00.000Z',
        hijiri: '1442-06-04'
      }
    }
  ]
};

export const transformedEventDates = [
  {
    year: 2020,
    eventDateInfo: [
      {
        month: {
          arabic: 'نوفمبر',
          english: 'November'
        },
        year: 2020,
        eventDate: {
          gregorian: '2020-12-16T00:00:00.000Z',
          hijiri: '1442-05-01'
        }
      },
      {
        month: {
          arabic: 'ديسمبر',
          english: 'December'
        },
        year: 2020,
        eventDate: {
          gregorian: '2021-01-17T00:00:00.000Z',
          hijiri: '1442-06-04'
        }
      }
    ]
  }
];
