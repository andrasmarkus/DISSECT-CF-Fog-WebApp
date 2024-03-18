export interface algorithmUploadData{
  ApplicationId: { $oid: string }
  DevicesId: { $oid: string },
  InstancesId: { $oid: string },
  code: string
}