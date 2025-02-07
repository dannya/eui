/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { hideStorybookControls } from '../../../.storybook/utils';

import { EuiButton, EuiText } from '../index';

import { EuiFlyout, EuiFlyoutProps, EuiFlyoutBody } from './index';

const meta: Meta<EuiFlyoutProps> = {
  title: 'EuiFlyout',
  component: EuiFlyout,
  args: {
    // Component defaults
    type: 'overlay',
    side: 'right',
    size: 'm',
    paddingSize: 'l',
    pushMinBreakpoint: 'l',
    closeButtonPosition: 'inside',
    hideCloseButton: false,
    ownFocus: true,
  },
};

export default meta;
type Story = StoryObj<EuiFlyoutProps>;

const StatefulFlyout = (props: Partial<EuiFlyoutProps>) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <EuiButton size="s" onClick={() => setIsOpen(!isOpen)}>
        Toggle flyout
      </EuiButton>
      {isOpen && <EuiFlyout {...props} onClose={() => setIsOpen(false)} />}
    </>
  );
};

export const Playground: Story = {
  render: ({ ...args }) => <StatefulFlyout {...args} />,
};

export const PushFlyouts: Story = {
  render: ({ ...args }) => {
    const fillerText = (
      <EuiText>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu
          condimentum ipsum, nec ornare metus. Sed egestas elit nec placerat
          suscipit. Cras pulvinar nisi eget enim sodales fringilla. Aliquam
          lobortis lorem at ornare aliquet. Mauris laoreet laoreet mollis.
          Pellentesque aliquet tortor dui, non luctus turpis pulvinar vitae.
          Nunc ultrices scelerisque erat eu rutrum. Nam at ligula enim. Ut nec
          nisl faucibus, euismod neque ut, aliquam nisl. Donec eu ante ut arcu
          rutrum blandit nec ac nisl. In elementum id enim vitae aliquam. In
          sagittis, neque vitae ultricies interdum, sapien justo efficitur
          ligula, sit amet fermentum nisl magna sit amet turpis. Nulla facilisi.
          Proin nec viverra mi. Morbi dolor arcu, ornare non consequat et,
          viverra dapibus tellus.
        </p>
      </EuiText>
    );
    return (
      <>
        <StatefulFlyout {...args}>
          <EuiFlyoutBody>{fillerText}</EuiFlyoutBody>
        </StatefulFlyout>
        {fillerText}
      </>
    );
  },
  args: {
    type: 'push',
    pushAnimation: false,
    pushMinBreakpoint: 'xs',
  },
  argTypes: hideStorybookControls([
    'onClose',
    'aria-label',
    'as',
    'closeButtonPosition',
    'closeButtonProps',
    'focusTrapProps',
    'hideCloseButton',
    'includeFixedHeadersInFocusTrap',
    'maskProps',
    'maxWidth',
    'outsideClickCloses',
    'ownFocus',
    'paddingSize',
    'style',
  ]),
};
