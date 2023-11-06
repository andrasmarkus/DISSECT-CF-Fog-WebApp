import { Component } from '@angular/core';
import { UserConfigurationService } from 'src/app/services/configuration/user-configuration/user-configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-configuration',
  templateUrl: './upload-configuration.component.html',
  styleUrls: ['./upload-configuration.component.css']
})
export class UploadConfigurationComponent {
  files: File[] = [null, null, null];
  fileContents: string[] = ['', '', ''];
  fileNames: string[] = ['', '', ''];

  constructor(
      public userConfigurationService: UserConfigurationService,
      public configService: UserConfigurationService,
      private snackBar: MatSnackBar,
    ){}

  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.files[index] = file;
      this.fileNames[index] = file.name;
    } else {
      this.files[index] = null;
      this.fileNames[index] = '';
    }
  }

  areAllFilesUploaded(): boolean {
    return this.files.every(file => file !== null);
  }

  async convertFilesToStrings(): Promise<void> {
    try {
      const readFileAsync = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const fileContent = event.target?.result as string;
            resolve(fileContent);
          };
          reader.onerror = (event) => {
            reject(event.target?.error);
          };
          reader.readAsText(file);
        });
      };

      const fileContents: string[] = [];
      for (const file of this.files) {
        if (file) {
          try {
            const fileContent = await readFileAsync(file);
            fileContents.push(fileContent);
          } catch (error) {
            console.error('Error reading in file:', error);
            // TODO file read error handle
          }
        }
      }

      this.userConfigurationService.sendAdminConfiguration(fileContents)
      this.snackBar.open('File uploaded successfully!', 'Close', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Hiba történt:', error);
    }
  }

  downloadinstances(){
    this.configService.downloadFileMongo("653e8e3e799e4f8bdd440001", "instances");
  }
}

