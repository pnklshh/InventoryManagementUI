import { Component, OnInit } from '@angular/core';
import { DatasharingService } from '../../service/datasharing-service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServiceCall } from '../../service/api-call.service';
import { Engineer } from '../../models/Engineer';

@Component({
  selector: 'ngx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public errorAlert: boolean = false;
  public successAlert: boolean = false;
  public message: string = "";
  public loading: boolean = false;
  public hostUrl: string = "";

  public emailId: string = "";
  public password: string = "";
  public confirmPassword: string = "";

  public isSendEmailPage: boolean = true;
  public isResetPassword: boolean = false;

  public engineer: Engineer = new Engineer();

  constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.datasharingService.hideLoader();
    this.hostUrl = this.apiCall.UIHostUrl;

    this.activatedRoute.params.subscribe(obj => {
      this.emailId = obj["emailId"];
    });
    if (this.activatedRoute.routeConfig.path.includes("resetpassword")){
      this.isSendEmailPage = false;
      this.isResetPassword = true;
      this.emailId = atob(this.emailId);
    }
    
  }

  resetPassword() {
    if (this.password != this.confirmPassword) {
      this.displayMessage("Error", "Password and Confirm Password do not match");
    }
    else {
      let url = "";
      if (this.isSendEmailPage)
        url = "api/Common/SendEmail?emailId=" + this.emailId;
      else if (this.isResetPassword)
        url = "api/Common/ResetPassword?emailId=" + this.emailId + "&newPassword=" + btoa(this.password);

      this.datasharingService.showLoader();
      this.loading = true;
      try {
        this.apiCall.GetData(url).subscribe(data => {
          data = JSON.parse(data);
          if (data.ErrorMessage != null && data.ErrorMessage != "") {
            this.datasharingService.hideLoader();
            this.loading = false;
            this.displayMessage("Error", data.ErrorMessage);
          }
          else {
            let engineer = null;
            this.datasharingService.hideLoader();
            this.loading = false;
            if (this.isSendEmailPage)
            {
              this.displayMessage("Success", data.SuccessMessage);
            }
            if (this.isResetPassword)
            {
              engineer = JSON.parse(data.AppData);
              this.displayMessage("Success", "Password reset successfully");
              this.datasharingService.setUserDetail(engineer);
              this.router.navigate(['/pages/dashboard']);
            }
          }
        },
          err => {
            console.log(err);
            // this.datasharingService.hideLoader();
            // this.loading = false;
          });
      }
      catch (ex) {
        console.log(ex);
        // this.datasharingService.hideLoader();
        // this.loading = false;
      }
    }
  }

  displayMessage(alert: string, message: string) {
    this.errorAlert = false;
    this.successAlert = false;
    if (alert == "Error")
      this.errorAlert = true;
    else if (alert == "Success")
      this.successAlert = true;

    this.message = message;
  }

  closeMessage() {
    this.errorAlert = false;
    this.successAlert = false;
    this.message = "";
  }
}
