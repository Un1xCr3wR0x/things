export class BPMComments {
  initiatorComment: string = undefined;
  initiatorCommentDate: string = undefined;
  initiatorRoleId: string = undefined;
  initiatorUserId: string = undefined;
  rasedComments?: RasedComment[] = [];
  tpaComments: TpaComment[] = [];
  userComment: UserComment[] = [];
}

export class RasedComment {
  rasedInitiatorComment: string;
  rasedRoleId: string;
  rasedUserId: string;
  rasedUpdatedDate: string;
}

export class TpaComment {
  tpaClarificationComments: string;
  tpaRoleId: string;
  tpaUserId: string;
  tpaUpdatedDate: string;
}

export class UserComment {
  comment: string;
  commentScope: string;
  taskId: string;
  updatedBy: CommentUpdatedBy;
  updatedDate: string;
}

export class CommentUpdatedBy {
  id: string;
  displayName: string;
  type: string;
}
