import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { adminConfiguration } from 'src/app/models/admin-configuration';
import { algorithmUploadData } from 'src/app/models/algorithm-upload-data';
import { SERVER_URL } from 'src/app/models/server-api/server-api';
@Injectable({
  providedIn: 'root'
})
export class AlgorithmUploadConfigurationService {
  constructor(private http: HttpClient) {}

  getAdminConfigurationFilesById(id: string): Observable<adminConfiguration> {
    return this.http.get<adminConfiguration>(`${SERVER_URL}configuration/getAdminConfigurations/${id}`)
  }

  getCustomConfigurations(): Observable<any>{
    return this.http.get<any[]>(`${SERVER_URL}configuration/getCustomSimulations`);
  }

  sendJobWithOwnAlgorithm(algorithmUploadData: algorithmUploadData){
    return this.http.post(`${SERVER_URL}configuration/ownAlgorithmConfiguration`, algorithmUploadData)
  }
}
