import express from 'express';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
import { ChatGPTAPI } from 'chatgpt';
import pTimeout from 'p-timeout';

import  * as fs from 'fs';
let ChatGPTSessionToken =
  '';


async function getChatGPTReply(content) {
  const api = new ChatGPTAPI({ sessionToken: ChatGPTSessionToken });
  await api.ensureAuth();
  const threeMinutesMs = 3 * 60 * 1000;
  const response = await pTimeout(api.sendMessage(content), {
    milliseconds: threeMinutesMs,
    message: 'ChatGPT timed out waiting for response',
  });
  return response;
}

app.get('/', async function (request, response) {
  try {
    const msg = request.query.msg;
    if (!msg) {
      response.send('问题不能为空哦');
      return;
    }
    const resMsg = await getChatGPTReply(msg);
    response.send(resMsg);
  } catch (err) {
    console.log(err);
    response.send('错误');
  }
});

app.post('/', async function (request, response) {
  try {
    const data = request.body;
    if (!data.msg) {
      response.send({ msg: '', retMsg: '问题不能为空哦' });
      return;
    }
    const resMsg = await getChatGPTReply(data.msg);
    response.send({ msg: data.msg, retMsg: resMsg });
  } catch (err) {
    console.log(err);
    response.send({msg: '', retMsg: '错误' });
  }
});

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// 本地运行开启以下
const PORT = 8848;
app.listen(PORT, async () => {
  const config = await fs.readFileSync('./config.yaml');
  ChatGPTSessionToken=config.toString().match(/TOKEN\: "(.*)"/)[1]
  console.log(`应用正在监听 ${PORT} 端口!`);

});
export default app ;
