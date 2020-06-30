<template>
    <div id="XID" v-if="campaigns" class="d-flex flex-column align-items-center justify-content-center">
        <b-card title="Small intro" class="w-75 p-3">
            <b-card-text>
                Here you can see a page with some tables of the push notifications campaigns.
            </b-card-text>

            <b-card-text>It is used for specifying and sending push notifications on your user's phones via OneSignal API.</b-card-text>

            <b-card-text>Enter user's ID. In this case it can be any number, as it is test page and test OneSignal keys.</b-card-text>

            <b-card-text>To start, please collapse any of Campaign below</b-card-text>

            <b-card-text>In the response field you can see how many notifications has been sent and how many of them were successful: recipients count. </b-card-text>
        </b-card>

        <b-container :key="'campaign' + index" class="d-flex flex-column align-items-center justify-content-center mt-5"
                     v-for="(campaign,index) in campaigns">
            <b-button
                    v-b-toggle="'collapseCampaign' + index"
                    class="m-1 w-25 p-3 mb-3"
                    variant="outline-primary"
            >
                <b-icon-plus-square-fill class="mr-1"></b-icon-plus-square-fill>
                Collapse {{campaign.CampaignName}}
            </b-button>
            <b-collapse :id="'collapseCampaign' + index">
                <table class="table">
                    <tbody>
                        <tr>
                            <th scope="row">One Signal AppID</th>
                            <td>{{campaign.OneSignalKeys.OneSignalAppID}}</td>
                        </tr>
                        <tr>
                            <th scope="row">Rest Api Key</th>
                            <td>{{campaign.OneSignalKeys.RestApiKey}}</td>
                        </tr>
                        <tr>
                            <th class="max-width-15" scope="row" style="cursor: pointer">
                                <span :id="'collapseUserIdHint' + index">
                                    User Ids
                                    <b-icon-question-circle class="ml-1"></b-icon-question-circle>
                                </span>
                                <b-tooltip :target="'collapseUserIdHint' + index" triggers="hover">
                                    Please, type here User's ID. If you have several, enter each separated by
                                    commas.
                                </b-tooltip>
                            </th>
                            <td>
                                <div class="input-group mb-3">
                                    <textarea aria-label="With textarea" class="form-control"
                                              v-model="userIDs[index]"></textarea>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th class="" scope="row" style="cursor: pointer">
                                <span :id="'collapseSendAfterHint' + index">
                                    Send by schedule
                                    <b-icon-question-circle class="ml-1"></b-icon-question-circle>
                                </span>
                                <b-tooltip :target="'collapseSendAfterHint' + index" triggers="hover">
                                    If you need to send after special time, you can enable this and put date and
                                    time that you need.
                                </b-tooltip>
                            </th>
                            <td>
                                <div class="custom-control custom-switch">
                                    <input
                                            :id="'customSwitch1' + index"
                                            class="custom-control-input"
                                            style="cursor: pointer"
                                            type="checkbox"
                                            v-model="showDateSendAfter[index]"
                                    >
                                    <label
                                            :for="'customSwitch1' + index"
                                            @click="changeShowDateSendAfter(index)"
                                            class="custom-control-label"
                                            style="cursor: pointer"
                                    >Toggle this to enter date (optional)</label>
                                </div>
                                <div class="text-muted mt-1 mb-3">
                                    Push will be sent in time you've been chosen, BUT in user's timezone.
                                </div>
                                <div class="form-group mt-2" v-show="showDateSendAfter[index]">
                                    <date-picker type="datetime" v-model="dateSendAfter[index]"></date-picker>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Notification Title</th>
                            <td>{{campaign.NotificationTitle}}</td>
                        </tr>
                        <tr>
                            <th scope="row">Notification Text:</th>
                            <td>{{campaign.PushNotificationText}}</td>
                        </tr>
                        <tr>
                            <th scope="row">Deep Link</th>
                            <td v-if="campaign.DeepLink">
                                <ul :key="field + index" class=""
                                    v-for="field in Object.keys(campaign.DeepLink)">
                                    <li class="">{{field}}: {{campaign.DeepLink[field]}}</li>
                                </ul>
                            </td>
                            <td v-else>
                                No Data
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Platform</th>
                            <td>
                                <div class="text-secondary mb-3">To only send to specific platforms, you may pass in
                                    true on one or more of these boolean parameters corresponding
                                    to the
                                    platform you wish to send to. If you do so, all other platforms will be set to
                                    false and will not be delivered to.
                                </div>
                                <ul :key="field + index + 'second'" class=""
                                    v-for="field in Object.keys(campaign.Platform)">
                                    <li class="">{{field}}: {{campaign.Platform[field] || false}}</li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="w-100 d-flex justify-content-center">
                    <b-button @click="pushCampaign(campaign,index)" class="m-1 w-25 p-3 mb-3" variant="outline-success">
                        <b-icon-chat-dots class="mr-1"></b-icon-chat-dots>
                        Send
                    </b-button>
                </div>

                <div class="card mb-3 mt-3">
                    <div class="card-body">
                        <h5 class="card-title">Response</h5>
                        <div v-if="responses[index].response">
                            <p class="card-text">Notifications has been sent:
                                {{responses[index].response.sentNotificationsCount}}</p>
                            <p class="card-text">Recipients: {{responses[index].response.recipients}}</p>
                        </div>
                        <div v-else> Here will be response, press Send and please wait.</div>
                    </div>
                </div>

                <div class="text-center">
                    <p class="text-danger">End of Push Campaign</p>
                </div>
            </b-collapse>
        </b-container>
    </div>
</template>

<script>
    import dataMock from "../dataMock";
    import sendPushNotification from "../utils/pushDataUtil";
    import DatePicker from 'vue2-datepicker';
    import 'vue2-datepicker/index.css';

    export default {
        name: "Form",
        components: {DatePicker},
        data() {
            return {
                campaigns: dataMock.Campaigns,
                oneSignalKeys: dataMock.oneSignalKeys,
                recipients: 0,
                // This array.map and others below is for different push campaigns as it could be a lot of campaigns and values for them.
                userIDs: dataMock.Campaigns.map(() => {
                    return ''
                }),
                hideCampaign: false,
                responses: dataMock.Campaigns.map(() => {
                    return 'here will be response'
                }),
                visible: dataMock.Campaigns.map(() => {
                    return false
                }),
                dateSendAfter: dataMock.Campaigns.map(() => {
                    return ''
                }),
                showDateSendAfter: dataMock.Campaigns.map(() => {
                    return false
                })
            };
        },
        methods: {
            async pushCampaign(campaign, index) {
                let newCampaign = this.createNewCampaign(campaign, index);

                this.$set(this.responses, index, await sendPushNotification(newCampaign));
                this.repeatCampaignFilters = this.responses[index].response.repeatCampaignFilters;
            },
            createNewCampaign(campaign, index) {
                let newCampaign = {
                    ...campaign,
                    UserIDs: this.userIDs[index] && this.userIDs[index].length ? this.userIDs[index].split(',').map(element => element.trim()) : [''],
                    RestApiKey: this.oneSignalKeys ? this.oneSignalKeys.RestApiKey : campaign.OneSignalKeys.RestApiKey,
                    OneSignalAppID: this.oneSignalKeys ? this.oneSignalKeys.OneSignalAppID : campaign.OneSignalKeys.OneSignalAppID
                }
                delete newCampaign.CampaignName;
                delete newCampaign.OneSignalKeys;
                if (this.showDateSendAfter[index] && this.dateSendAfter[index]) {
                    newCampaign.sendAfter = this.dateSendAfter[index];
                } else {
                    newCampaign.sendAfter = null
                }
                return newCampaign;
            },
            changeShowDateSendAfter(index) {
                this.showDateSendAfter[index] = !this.showDateSendAfter[index];
            }
        }
    };
</script>

<style>
    th {
        width: 20%;
    }
</style>
