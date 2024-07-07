export const TransferAllContributorData = {
  editFlow: true,
  comments: 'string',
  transferTo: 0,
  requestId: 123456,
  transferAll: true,
  transferItem: [
    {
      engagementId: 1569355076,
      transferTo: 1
    }
  ]
};

export const transferAllBranches = {
  branchList: [
    {
      name: {
        arabic: 'مدارس فيصل عبدالله الخالدي الاهليه',
        english: null
      },
      registrationNo: 200074335,
      status: {
        arabic: 'مسجلة',
        english: 'Registered'
      },
      location: {
        arabic: 'الخبر',
        english: 'Khobar'
      },
      establishmentType: {
        arabic: 'رئيسية',
        english: 'Main'
      },
      fieldOffice: {
        arabic: 'مكتب المنطقة الشرقية',
        english: 'Eastern R Office'
      },
      closingDate: undefined
    },
    {
      name: {
        arabic: '???? ???? ???????? ???????',
        english: null
      },
      registrationNo: 200074351,
      status: {
        arabic: 'مسجلة',
        english: 'Registered'
      },
      location: {
        arabic: 'الخبر',
        english: 'Khobar'
      },
      establishmentType: {
        arabic: 'فرعية',
        english: 'Branch'
      },
      fieldOffice: {
        arabic: 'مكتب المنطقة الشرقية',
        english: 'Eastern R Office'
      },
      closingDate: undefined
    }
  ],
  branchStatus: {
    activeEstablishments: 2,
    openingInProgress: 0,
    closingInProgress: 0,
    totalBranches: 2,
    closedEstablishments: 0,
    proactiveEstablishments: 1,
    gccEstablishments: 0
  }
};

export const transferAllNoWorkflowError = {
  error: {
    code: 'CON-ERR-5208',
    message: {
      english: 'No records',
      arabic: 'No records'
    }
  }
};
