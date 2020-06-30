import _ from "lodash";
import axios from "axios";

let requestsArray = [];
let response = {
    sentNotificationsCount: 0,
    recipients: 0,
};
let filters = [];

function createUserIDsAndFilters(campaign) {
    filters = [];
    if (campaign.UserIDs.length > 1) {
        let newUserIDsArray = campaign.UserIDs;
        response.sentNotificationsCount = newUserIDsArray.length;
        newUserIDsArray = newUserIDsArray.map(element => {
            return {
                "key": "UserId",
                "field": "tag",
                "value": element,
                "relation": "="
            };
        });
        // Chunked because onesignal can receive only 100 users per request.
        newUserIDsArray = _.chunk(newUserIDsArray, 100);
        filters = newUserIDsArray.map(element => {
            element = element.reduce((r, elem) => r.concat(elem, {
                    "operator": "OR"
                }
            ), []);
            //Deletes las OR to except sending to everybody
            element.pop();
            return element;
        });
    } else if (campaign.UserIDs.length === 1) {
        filters = [];
        response.sentNotificationsCount = 1;
        if (campaign.UserIDs[0]) {
            filters.push([{
                "key": "UserId",
                "field": "tag",
                "value": campaign.UserIDs[0],
                "relation": "="
            }]);
        }
        //This is for sending to everybody.
        if (campaign.UserIDs[0] === '') {
            filters.push([{
                "operator": "OR"
            }]);
        }
    }
}

function prepareMessage(filter, campaign) {
    let message = {
        app_id: campaign.OneSignalAppID,
        contents: {
            "en": campaign.PushNotificationText
        },
        headings: {
            "en": campaign.NotificationTitle
        },
        filters: filter,
        isIos: campaign.Platform.Ios,
        isAndroid: campaign.Platform.Android,
        ios_badgeType: "SetTo",
        ios_badgeCount: "0",
        android_background_data: "true",
        data: campaign.DeepLink && campaign.DeepLink.EntityType ? campaign.DeepLink : {}
    };
    if (campaign.sendAfter) {
        message.send_after = campaign.sendAfter;
        message.delayed_option = 'timezone';
    }

    return { ...message};
}

function prepareResponse(results) {
    let validResults = results.filter(result => result.status === 200);
    response.recipients = validResults.reduce(
        (acc, elem) => {
            return acc + elem.data.recipients
        },
        0
    )
}

export default async function sendPushNotification (campaign) {
    if (campaign.UserIDs.length) {
        createUserIDsAndFilters(campaign);

        filters.forEach(element => {
            const authOptions = {
                method: 'POST',
                url: 'https://onesignal.com/api/v1/notifications',
                data: prepareMessage(element, campaign),
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": `Basic ${campaign.RestApiKey}`
                },
                json: true
            };
            requestsArray.push(axios(authOptions));
        });

        const results = await Promise.all(requestsArray);

        await prepareResponse(results);

        return {
            response
        }

    } else {
        throw new Error(`No User's ID`)
    }
}




