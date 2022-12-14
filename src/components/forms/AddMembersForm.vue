<template>
    <el-form>
        <el-form-item>
            <el-select
                style="width: 100%"
                v-model="form.usernameList"
                :placeholder="lang.enterUsername"
                :no-data-text="lang.enterUsernameToAddMembers"
                multiple filterable allow-create default-first-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button @click="submit" type="primary">
                <div v-text="lang.add"/>
            </el-button>
            <el-button @click="clear">
                <div v-text="lang.reset"/>
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
    import { inject, reactive } from "vue";
    import AddProjectMembersForm from "@/utils/forms/AddProjectMembersForm";
    import StatusCode from "@/utils/enums/StatusCode";
    import ApplicationUtils from "@/utils/ApplicationUtils";
    import RequestUtils from "@/utils/RequestUtils";

    defineExpose({ clearForm });

    const props = defineProps({
        uuid: { type: String, required: true }
    });
    const lang = ApplicationUtils.locale.form.addMembers;
    const message = ApplicationUtils.locale.message;
    const reload: Function = inject("reload")!;

    const form = reactive<AddProjectMembersForm>({
        usernameList: [],
        projectUUID: props.uuid
    });

    function clearForm() {
        form.usernameList = [];
    }

    function clear() {
        if (form.usernameList.length === 0)
            ApplicationUtils.showMessage(message.youHaveNotModifiedForm, "warning");
        else {
            ApplicationUtils.showMessage(message.resetSuccessfully, "success");
            clearForm();
        }
    }

    function submit() {
        if (form.usernameList.length === 0) {
            ApplicationUtils.showMessage(message.youHaveNotModifiedForm, "warning");
            return;
        }

        RequestUtils.inviteMembers(form).then(resp => {
            if (resp === StatusCode.projectNotFound)
                ApplicationUtils.showMessage(message.projectNotFound, "error");

            if (resp === StatusCode.success) {
                ApplicationUtils.showMessage(message.addSuccessfully, "success");
                reload();
            }
        }).catch(() => ApplicationUtils.showMessage(message.timeout, "error"));
    }
</script>
