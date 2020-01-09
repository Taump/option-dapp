import { isEmpty } from "lodash";

const createObjectResponseNotification = (data, aaVars) => {
  const address = data.aa_address;
  if (!isEmpty(data.response)) {
    const res = data.response;
    if (res.responseVars) {
      const resVars = res.responseVars;
      if ("yes_asset" in resVars) {
        return {
          AA: address,
          title: "Yes_asset was issued",
          tag: "res_yes"
        };
      } else if ("no_asset" in resVars) {
        return {
          AA: address,
          title: "No_asset was issued",
          tag: "res_no"
        };
      } else if ("winner" in resVars) {
        return {
          AA: address,
          title: `${resVars.winner}_asset was chosen as the winner`,
          tag: "res_winner"
        };
      }
    } else if ("error" in res) {
      return {
        AA: address,
        title: res.error,
        tag: "error"
      };
    } else {
      return undefined;
    }
  } else {
    if (data.objResponseUnit) {
      const objResponseUnit = data.objResponseUnit;
      if (objResponseUnit.messages) {
        const msg = objResponseUnit.messages;
        if (aaVars.yes_asset && aaVars.no_asset) {
          if (
            msg[0] &&
            msg[0].payload &&
            msg[0].payload.asset === aaVars.yes_asset &&
            msg[1] &&
            msg[1].payload &&
            msg[1].payload.asset === aaVars.no_asset
          ) {
            if (
              msg[0].payload.inputs &&
              msg[0].payload.inputs[0] &&
              msg[0].payload.inputs[0].type === "issue" &&
              msg[1].payload.inputs &&
              msg[1].payload.inputs[0] &&
              msg[1].payload.inputs[0].type === "issue"
            ) {
              const recipientAmount = msg[0].payload.inputs[0].amount;
              return {
                AA: address,
                title: `${data.trigger_address} invested ${recipientAmount} bytes`,
                tag: "res_invest"
              };
            }
          } else if (
            msg[0] &&
            msg[0].payload.inputs &&
            "unit" in msg[0].payload.inputs[0] &&
            "unit" in msg[0].payload.inputs[1]
          ) {
            return {
              AA: address,
              title: `${data.trigger_address} bought ${msg[0].payload.outputs[0].amount} bytes`,
              tag: "res_invest"
            };
          }
        }
      } else {
        return undefined;
      }
    }
  }
};

const createObjectRequestNotification = data => {
  console.log(data);
  if (
    data.body.messages[0].payload &&
    data.body.messages[1] &&
    data.body.messages[1].payload
  ) {
    const messages = data.body.messages;
    const payload = messages[0].payload;
    const AA = messages[1].payload.outputs[1].address;

    if ("define_yes" in payload) {
      return {
        AA,
        title: "Request for issue yes_asset",
        tag: "req_yes"
      };
    } else if ("define_no" in payload) {
      return {
        AA,
        title: "Request for issue no_asset",
        tag: "req_no"
      };
    } else if ("winner" in payload) {
      return {
        AA,
        title: "Request to select a winner",
        tag: "req_winner"
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};
export default {
  res: createObjectResponseNotification,
  req: createObjectRequestNotification
};
