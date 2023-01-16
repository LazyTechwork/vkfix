import amadeus_actions from '../amadeus_actions';
import message_actions, {isModuleConversationKickEnabled} from '../message_actions';
import VKLocation from '../../classes/VKLocation';
import leavekick from '../leavekick';

export default function (mutation: MutationRecord) {
  if (mutation.target.nodeType !== 1) {
    return;
  } // Если мутация текст - переходим дальше
  if (!VKLocation.isConversation()) {
    return;
  }

  let target: HTMLElement = mutation.target as HTMLElement; // Получаем цель мутации
  let classes: DOMTokenList = target.classList; // Получаем список классов

  if (!classes) {
    return;
  } // Если их нет - переходим дальше
  let isMsg = classes.contains('im-mess');
  for (const n of target.children) {
    if (!n.classList) {
      continue;
    }

    if (isMsg && n.classList.contains('im-mess--actions'))  // Если это группа действий и в ней нет наших кнопок -
                                                        // добавляем их
    {
      mutation_act(n);
    }

    if (n.classList.contains('ui_clean_list')) // Если это событие беседы добавляем кик к ним
    {
      if (n.children[0].classList.contains('im-mess_srv')) {
        action_mutation_act(n.children[0].children[0]);
      }
    }
  }
}

export function mutation_act(n: any) {
  amadeus_actions(n);
  message_actions(n);
}

export function action_mutation_act(n: any) {
  if (isModuleConversationKickEnabled) {
    leavekick(n);
  }
}
