/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
import {
  Contact,
  Message,
  ScanStatus,
  Wechaty,
  log,
} from 'wechaty';

import {generate} from 'qrcode-terminal'
import LinkedList = require('linked-list');
import ms = require('ms');

function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    generate(qrcode, {small: true})  // show qrcode on console

    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin(user: Contact) {
  log.info('StarterBot', '%s login', user)
}

function onLogout(user: Contact) {
  log.info('StarterBot', '%s logout', user)
}


class SpeakerNode extends LinkedList.Item {
  constructor(public speaker: string, public time: number) {
    super();
  }
}

class SpeakerList extends LinkedList<SpeakerNode> {

}

const timeLimit = process.env.TIME_LIMIT && parseInt(process.env.TIME_LIMIT, 10) || 30 * 60 * 1000;
const speakLimit = process.env.SPEAK_LIMIT && parseInt(process.env.SPEAK_LIMIT, 10) || 3;
const speakManage = (() => {
  const list = new SpeakerList();
  return {
    needMentionAfterAppend: (speaker: string, now: number) => {
      list.append(new SpeakerNode(speaker, now));
      const oldTime = now - timeLimit;
      let _speakLimit = speakLimit;
      for (const speakNode of list) {

        if (speakNode.time <= oldTime) {
          speakNode.detach();
        } else if (speakNode.speaker === speaker) {
          _speakLimit--;
          if (_speakLimit < 0) {
            return true;
          }
        }
      }
      return false;
    }
  };
})();

async function onMessage(msg: Message) {
  const room = msg.room();
  const from = msg.from();
  if (await msg.mentionSelf()) {
    await msg.say('你说什么？');
    return;
  }

  if (!from || !room) {
    return;
  }

  if (!process.env.ROOM) {
    console.log(`群信息:${room.toString()},<${room.id}>`);
    return;
  } else if (room.id !== process.env.ROOM) {
    return;
  }
  if (speakManage.needMentionAfterAppend(from.id, Date.now())) {
    // await msg.say('多话');
    await bot.puppet.messageSendText(room.id, `@${from.name()} ${process.env.MENTION_TEXT || `请${ms(timeLimit)}内不要超过${speakLimit}次发消息哦`}`, [from.id]);
  }


}

const bot = new Wechaty({
  name: 'speaker-mention-bot',
  /**
   * Specify a

   `puppet`

   for a specific protocol (Web/Pad/Mac/Windows, etc).
   *
   * You can use the following providers:
   *  - wechaty-puppet-hostie
   *  - wechaty-puppet-puppeteer
   *  - wechaty-puppet-padplus
   *  - etc.
   *
   * Learn more about Wechaty Puppet Providers at:
   *  https://github.com/wechaty/wechaty-puppet/wiki/Directory
   */

  // puppet: 'wechaty-puppet-hostie',

});

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e));
