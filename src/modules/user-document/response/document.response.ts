import { DocumentVerificationEnum } from 'commons/enums';

export interface IDocumentResponse {
  id: string;
  name: string;
  url: string;
  status: DocumentVerificationEnum;
  comments: string;
  documentExpiryDate: Date;
}
