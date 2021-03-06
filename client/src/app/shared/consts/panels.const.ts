import {PanelType} from '../enums/panel-type.enum';

export const PANELS = Object.freeze([
  {
    header: '4x4',
    panels: [
      {
        name: 'Latest Pushes',
        description: 'A list showing push request from a member',
        type: PanelType.MemberPush,
        layout: {
          colSpan: 4,
          rowSpan: 4
        }
      }
    ]
  }
]);
