import axios from "axios";
import LocalStorageUtils from "@/utils/LocalStorageUtils";
import Response from "@/utils/dto/Response";
import SignInForm from "@/utils/forms/SignInForm";
import SignUpForm from "@/utils/forms/SignUpForm";
import UserInformation from "@/utils/dto/UserInformation";
import ProjectMemberInformation from "@/utils/dto/ProjectMemberInformation";
import NewTaskForm from "@/utils/forms/NewTaskForm";
import HeatMapData from "@/utils/dto/HeatMapData";
import AvatarForm from "@/utils/forms/AvatarForm";
import EditProfileForm from "@/utils/forms/EditProfileForm";
import PageInformation from "@/utils/dto/PageInformation";
import ProjectInformation from "@/utils/dto/ProjectInformation";
import NewProjectForm from "@/utils/forms/NewProjectForm";
import UpdateProjectForm from "@/utils/forms/UpdateProjectForm";
import TaskInformation from "@/utils/dto/TaskInformation";
import SessionStorageUtils from "@/utils/SessionStorageUtils";
import TokenUtils from "@/utils/TokenUtils";
import router from "@/plugins/VueRouter";
import Role from "@/utils/po/Role";
import AddProjectMembersForm from "@/utils/forms/AddProjectMembersForm";
import StatusCode from "@/utils/enums/StatusCode";
import ApplicationUtils from "@/utils/ApplicationUtils";
import TaskMemberInformation from "@/utils/dto/TaskMemberInformation";

const source = axios.CancelToken.source();

axios.interceptors.request.use(config => {
    if (SessionStorageUtils.getAccessMode() === "visitor") return config;
    if (LocalStorageUtils.getToken() === "") return config;

    const token = config.headers?.Authorization as string;
    if (TokenUtils.isInvalid(token)) {
        config.cancelToken = source.token;
        source.cancel("Token invalid");
        SessionStorageUtils.setAccessMode("visitor");
        LocalStorageUtils.removeToken();
        router.push({ name: "signIn" });
    }
    return config;
});

axios.interceptors.response.use(response => {
    const responseVO: Response<any> | number = response.data;
    let statusCode = 0;
    if (typeof responseVO === "number")
        statusCode = responseVO;
    else
        statusCode = responseVO.statusCode;

    const message = ApplicationUtils.locale.message.status;
    switch (statusCode) {
        case StatusCode.unknown:
            ApplicationUtils.showMessage(message.unknown, "error");
            break;
        case StatusCode.recordNotFound:
            ApplicationUtils.showMessage(message.recordNotFound, "error");
            break;
        case StatusCode.invalidParams:
            ApplicationUtils.showMessage(message.invalidParams, "error");
            break;
        case StatusCode.requiredParamsIsEmpty:
            ApplicationUtils.showMessage(message.requiredParamsIsEmpty, "error");
            break;
        case StatusCode.invalidFiletype:
            ApplicationUtils.showMessage(message.invalidFiletype, "error");
            break;
        case StatusCode.notUpdate:
            ApplicationUtils.showMessage(message.notUpdate, "error");
            break;
        case StatusCode.permissionDenied:
            ApplicationUtils.showMessage(message.permissionDenied, "error");
            break;
        case StatusCode.uuidConflict:
            ApplicationUtils.showMessage(message.uuidConflict, "error");
            break;
        case StatusCode.tokenIsEmpty:
            ApplicationUtils.showMessage(message.tokenIsEmpty, "error");
            break;
        case StatusCode.expiredToken:
            ApplicationUtils.showMessage(message.expiredToken, "error");
            break;
        case StatusCode.invalidToken:
            ApplicationUtils.showMessage(message.invalidToken, "error");
            break;
        case StatusCode.vCodeRecordNotFound:
            ApplicationUtils.showMessage(message.vCodeRecordNotFound, "error");
            break;
        case StatusCode.expiredVCode:
            ApplicationUtils.showMessage(message.expiredVCode, "error");
            break;
        case StatusCode.vCodeError:
            ApplicationUtils.showMessage(message.vCodeError, "error");
            break;
        case StatusCode.invalidVCode:
            ApplicationUtils.showMessage(message.invalidVCode, "error");
            break;
        case StatusCode.passwordError:
            ApplicationUtils.showMessage(message.passwordError, "error");
            break;
        case StatusCode.userNotFound:
            ApplicationUtils.showMessage(message.userNotFound, "error");
            break;
        case StatusCode.userExists:
            ApplicationUtils.showMessage(message.userExists, "error");
            break;
        case StatusCode.projectNotFound:
            ApplicationUtils.showMessage(message.projectNotFound, "error");
            break;
        case StatusCode.roleNotFound:
            ApplicationUtils.showMessage(message.roleNotFound, "error");
            break;
        case StatusCode.roleRecordExists:
            ApplicationUtils.showMessage(message.roleRecordExists, "error");
            break;
    }

    return response;
});

class RequestUrl {
    private static readonly baseUrl = "http://10.117.12.66:8181/";

    private static readonly accountController = "account/";
    private static readonly projectController = "project/";
    private static readonly emailController = "mail/";
    private static readonly memberController = "member/";
    private static readonly taskController = "task/";
    private static readonly roleController = "role/";

    // Account Controller
    public static readonly signIn = this.baseUrl + this.accountController + "signIn";
    public static readonly signUp = this.baseUrl + this.accountController + "signUp";
    public static readonly autoSignIn = this.baseUrl + this.accountController + "autoSignIn";
    public static readonly getAvatar = RequestUrl.baseUrl + RequestUrl.accountController + "getAvatar";
    public static readonly updateAvatar = this.baseUrl + this.accountController + "updateAvatar";
    public static readonly updateProfile = this.baseUrl + this.accountController + "updateProfile";
    public static readonly getUserInformation = this.baseUrl + this.accountController + "getUserInfo";

    // Email Controller
    public static readonly sendVCode = this.baseUrl + this.emailController + "signUpVCode";

    // Project Controller
    public static readonly getOnePageUserProjects = this.baseUrl + this.projectController + "getOnePage";
    public static readonly createProject = this.baseUrl + this.projectController + "new";
    public static readonly getProjectInformation = this.baseUrl + this.projectController + "get";
    public static readonly updateProject = this.baseUrl + this.projectController + "update";

    // Member Controller
    public static readonly addProjectMembers = this.baseUrl + this.memberController + "add";
    public static readonly removeProjectMembers = this.baseUrl + this.memberController + "remove";
    public static readonly updateMemberRole = this.baseUrl + this.memberController + "update";
    public static readonly getOnePageProjectMemberInfo = this.baseUrl + this.memberController + "getOnePageFromProject";
    public static readonly getProjectMemberInformation = this.baseUrl + this.memberController + "getAllFromProject";

    // Task Controller
    public static readonly getHeatMap = this.baseUrl + this.taskController + "getHeatMap";
    public static readonly newTask = this.baseUrl + this.taskController + "new";
    public static readonly getOnePaeProjectTasks = this.baseUrl + this.taskController + "getOnePageFromProject";
    public static readonly getTaskMembers = this.baseUrl + this.taskController + "getTaskMembers";
    public static readonly updateTitle = this.baseUrl + this.taskController + "updateTitle";
    public static readonly updatePrincipal = this.baseUrl + this.taskController + "updatePrincipal";
    public static readonly updateStartTime = this.baseUrl + this.taskController + "updateStartTime";
    public static readonly updateDeadline = this.baseUrl + this.taskController + "updateDeadline";

    // Role Controller
    public static readonly newRole = this.baseUrl + this.roleController + "new";
    public static readonly updateRole = this.baseUrl + this.roleController + "update";
    public static readonly removeRole = this.baseUrl + this.roleController + "remove";
    public static readonly getRoles = this.baseUrl + this.roleController + "getAllFromProject";
    public static readonly getOnePageRoles = this.baseUrl + this.roleController + "getOnePageFromProject";
}

export default class RequestUtils {
    private static readonly defaultTimeout: number = 3000;

    private static async get(url: string, form: any, timeout?: number): Promise<Response<any> | any> {
        return (await axios.get(url, {
            params: form,
            timeout: timeout || this.defaultTimeout,
            headers: { Authorization: LocalStorageUtils.getToken() }
        })).data;
    }

    private static async post(url: string, form: any, timeout?: number): Promise<Response<any> | any> {
        return (await axios.post(url, form, {
            headers: { Authorization: LocalStorageUtils.getToken() },
            timeout: timeout || this.defaultTimeout
        })).data;
    }

    private static toFormData(obj: any): FormData {
        const formData = new FormData();
        Object.keys(obj).map(key => formData.append(key, obj[key]));
        return formData;
    }

    // Account Controller
    public static async autoSignIn(): Promise<Response<string>> {
        return (await this.post(RequestUrl.autoSignIn, null));
    }

    public static async signUp(form: SignUpForm): Promise<number> {
        return (await this.post(RequestUrl.signUp, this.toFormData(form)));
    }

    public static async signIn(form: SignInForm): Promise<Response<string>> {
        return (await this.post(RequestUrl.signIn, this.toFormData(form)));
    }

    public static async getUserInformation(username: string): Promise<Response<UserInformation>> {
        return (await this.get(RequestUrl.getUserInformation, { username }, 1500));
    }

    public static async getAvatar(username: string): Promise<Response<string>> {
        return (await this.get(RequestUrl.getAvatar, { username }, 1500));
    }

    public static async updateAvatar(form: AvatarForm): Promise<number> {
        return (await this.post(RequestUrl.updateAvatar, this.toFormData(form)));
    }

    public static async updateProfile(form: EditProfileForm): Promise<number> {
        return (await this.post(RequestUrl.updateProfile, this.toFormData(form)));
    }

    // Email Controller
    public static async getSignUpCode(email: string): Promise<Response<string>> {
        return (await this.post(RequestUrl.sendVCode, this.toFormData({ email })));
    }

    // Project Controller
    public static async getOnePageUserProjects(pageNum: number, pageSize: number): Promise<Response<PageInformation<ProjectInformation>>> {
        return (await this.get(RequestUrl.getOnePageUserProjects, { pageNum, pageSize }));
    }

    public static async newProject(form: NewProjectForm): Promise<Response<string>> {
        return (await this.post(RequestUrl.createProject, this.toFormData(form)));
    }

    public static async getProjectInformation(projectUUID: String): Promise<Response<ProjectInformation>> {
        return (await this.get(RequestUrl.getProjectInformation, { projectUUID }));
    }

    public static async updateProject(form: UpdateProjectForm): Promise<number> {
        return (await this.post(RequestUrl.updateProject, this.toFormData(form)));
    }


    // Member Controller
    public static async addProjectMembers(form: AddProjectMembersForm): Promise<Response<number>> {
        return (await this.post(RequestUrl.addProjectMembers, this.toFormData(form)));
    }

    public static async removeProjectMember(recordUUID: string): Promise<number> {
        return this.removeProjectMembers({ recordUUIDList: [recordUUID] });
    }

    public static async removeProjectMembers(form: { recordUUIDList: Array<String> }): Promise<number> {
        return (await this.post(RequestUrl.removeProjectMembers, this.toFormData(form)));
    }

    public static async updateMemberRole(recordUUID: string, roleUUID: string) {
        await this.post(RequestUrl.updateMemberRole, this.toFormData({ recordUUID, roleUUID }));
    }

    public static async getOnePageProjectMemberInformation(pageNum: number, pageSize: number, projectUUID: String): Promise<Response<PageInformation<ProjectMemberInformation>>> {
        return (await this.get(RequestUrl.getOnePageProjectMemberInfo, { pageNum, pageSize, projectUUID }));
    }

    public static async getProjectMemberInformation(projectUUID: String): Promise<Response<Array<ProjectMemberInformation>>> {
        return (await this.get(RequestUrl.getProjectMemberInformation, { projectUUID }));
    }

    // Task Controller
    public static async getHeatMap(userUUID: String): Promise<Response<Array<HeatMapData>>> {
        return (await this.get(RequestUrl.getHeatMap, { userUUID }, 1000));
    }

    public static async newTask(form: NewTaskForm): Promise<number> {
        if (form.startTime !== "")
            (form.startTime as Date).setHours((form.startTime as Date).getHours() + 8);
        if (form.deadline !== "")
            (form.deadline as Date).setHours((form.deadline as Date).getHours() + 8);
        return (await this.post(RequestUrl.newTask, form));
    }

    public static async getOnePageProjectTasks(pageNum: number, pageSize: number, projectUUID: string): Promise<Response<PageInformation<TaskInformation>>> {
        return (await this.get(RequestUrl.getOnePaeProjectTasks, { pageNum, pageSize, projectUUID }));
    }

    public static async getTaskMembers(taskUUID: string): Promise<Response<Array<TaskMemberInformation>>> {
        return (await this.get(RequestUrl.getTaskMembers, { taskUUID }));
    }

    public static async updateTitle(taskUUID: string, title: string): Promise<number> {
        return (await this.post(RequestUrl.updateTitle, this.toFormData({ taskUUID, title })));
    }

    public static async updatePrincipal(taskUUID: string, principalUUID: string): Promise<number> {
        return (await this.post(RequestUrl.updatePrincipal, this.toFormData({ taskUUID, principalUUID })));
    }

    public static async updateStartTime(taskUUID: string, startTime: string): Promise<number> {
        return (await this.post(RequestUrl.updateStartTime, this.toFormData({ taskUUID, startTime })));
    }

    public static async updateDeadline(taskUUID: string, deadline: string): Promise<number> {
        return (await this.post(RequestUrl.updateDeadline, this.toFormData({ taskUUID, deadline })));
    }

    // Role Controller
    public static async getOnePageRoles(projectUUID: string, pageNum: number, pageSize: number): Promise<Response<PageInformation<Role>>> {
        return (await this.get(RequestUrl.getOnePageRoles, { projectUUID, pageNum, pageSize }));
    }

    public static async updateRole(role: Role): Promise<number> {
        return (await this.post(RequestUrl.updateRole, this.toFormData(role)));
    }

    public static async removeRole(roleUUID: string): Promise<number> {
        return (await this.post(RequestUrl.removeRole, this.toFormData({ roleUUID })));
    }

    public static async newRole(role: Role): Promise<number> {
        return (await this.post(RequestUrl.newRole, this.toFormData(role)));
    }

    public static async getRoles(projectUUID: string): Promise<Response<Array<Role>>> {
        return (await this.get(RequestUrl.getRoles, { projectUUID }));
    }
}
