import { Component, OnInit } from '@angular/core';
import { Engineer } from '../../models/Engineer';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceCall } from '../../service/api-call.service';
import { DatasharingService } from '../../service/datasharing-service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public errorAlert: boolean = false;
  public successAlert: boolean = false;
  public message: string = "";
  public loading: boolean = false;
  public hostUrl: string;

  public engineer: Engineer = new Engineer();

  constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.datasharingService.hideLoader();
    this.hostUrl = this.apiCall.UIHostUrl;
  }

  login() {
    let url = "api/Common/ValidateLogin?emailid=" + this.engineer.EmailID + "&password=" + btoa(this.engineer.Password);
    this.errorAlert = false;
    this.successAlert = false;

    this.datasharingService.showLoader();
    this.loading = true;
    try {
      this.apiCall.GetData(url).subscribe(data => {
        data = JSON.parse(data);
        let msg = "";
        if (data.ErrorMessage != null && data.ErrorMessage != "") {
          this.datasharingService.hideLoader();
          this.loading = false;
          msg = data.ErrorMessage;
          if(msg.toLowerCase().includes("timeout"))
            msg = "Database server down";
          this.displayMessage("Error", msg);
        }
        else {
          let engineer = JSON.parse(data.AppData);
          this.datasharingService.hideLoader();
          this.loading = false;
          this.displayMessage("Success", "Login successful");
          this.datasharingService.setUserDetail(engineer);
          this.router.navigate(['/pages/dashboard']);
        }
      },
        err => {
          console.log(err);
        });
    }
    catch (ex) {
      console.log(ex);
    }
  }

  navigateToSendEmail()
  {
    if(this.engineer.EmailID == "")
      this.router.navigate(['/auth/sendemail']);
    else
      this.router.navigate(['/auth/sendemail',this.engineer.EmailID]);
  }

  displayMessage(alert: string, message:string)
  {
      this.errorAlert=false;
      this.successAlert=false;
      if(alert=="Error")
          this.errorAlert=true;
      else if(alert=="Success")
          this.successAlert=true;
      
      this.message=message;    
  }

  closeMessage()
  {
      this.errorAlert=false;
      this.successAlert=false;
      this.message="";
  }

}
