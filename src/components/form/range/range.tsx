/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { Component, ReactNode } from 'react';
import classNames from 'classnames';

import { isWithinRange } from '../../../services/number';
import { EuiInputPopover } from '../../popover';
import {
  htmlIdGenerator,
  withEuiTheme,
  WithEuiThemeProps,
} from '../../../services/';

import { FormContext, FormContextValue } from '../eui_form_context';
import { getLevelColor } from './range_levels_colors';
import { EuiRangeHighlight } from './range_highlight';
import { EuiRangeInput } from './range_input';
import { EuiRangeLabel } from './range_label';
import { EuiRangeSlider } from './range_slider';
import { EuiRangeTooltip } from './range_tooltip';
import { EuiRangeTrack } from './range_track';
import { EuiRangeWrapper } from './range_wrapper';

import type { EuiRangeProps } from './types';

import { euiRangeStyles } from './range.styles';
import { EuiI18n } from '../../i18n';

export class EuiRangeClass extends Component<
  EuiRangeProps & WithEuiThemeProps
> {
  static contextType = FormContext;

  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    compressed: false,
    isLoading: false,
    showLabels: false,
    showInput: false,
    showRange: false,
    showTicks: false,
    showValue: false,
    levels: [],
  };

  preventPopoverClose: boolean = false;

  state = {
    id: this.props.id || htmlIdGenerator()(),
    isPopoverOpen: false,
    trackWidth: 0,
  };

  handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    const isValid = isWithinRange(
      this.props.min,
      this.props.max,
      e.currentTarget.value
    );
    if (this.props.onChange) {
      this.props.onChange(e, isValid);
    }
  };

  get isValid() {
    return isWithinRange(
      this.props.min,
      this.props.max,
      this.props.value || ''
    );
  }

  rangeSliderRef = (ref: HTMLInputElement | null) => {
    this.setState({ trackWidth: ref?.clientWidth || 0 });
  };

  onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
    this.setState({
      isPopoverOpen: true,
    });
  };

  onInputBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    setTimeout(() => {
      // Safari does not recognize any focus-related eventing for input[type=range]
      // making it impossible to capture its state using active/focus/relatedTarget
      // Instead, a prevention flag is set on mousedown, with a waiting period here.
      // Mousedown is viable because in the popover case, it is inaccessible via keyboard (intentionally)
      if (this.preventPopoverClose) {
        this.preventPopoverClose = false;
        return;
      }
      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
      this.closePopover();
    }, 200);

  closePopover = () => {
    this.preventPopoverClose = false;
    this.setState({
      isPopoverOpen: false,
    });
  };

  render() {
    const { defaultFullWidth } = this.context as FormContextValue;
    const {
      className,
      compressed,
      disabled,
      fullWidth = defaultFullWidth,
      isLoading,
      readOnly,
      id: propsId,
      max,
      min,
      name,
      step,
      showLabels,
      showInput,
      inputPopoverProps,
      showTicks,
      tickInterval,
      ticks,
      levels,
      showRange,
      showValue,
      valueAppend,
      valuePrepend,
      onBlur,
      onChange,
      onFocus,
      value,
      tabIndex,
      isInvalid,
      theme,
      ...rest
    } = this.props;

    const { id } = this.state;

    const showInputOnly = showInput === 'inputWithPopover';
    const canShowDropdown = showInputOnly && !readOnly && !disabled;

    const theInput: ReactNode = !!showInput ? (
      <EuiRangeInput
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        compressed={compressed}
        onChange={this.handleOnChange}
        name={name}
        onFocus={canShowDropdown ? this.onInputFocus : onFocus}
        onBlur={canShowDropdown ? this.onInputBlur : onBlur}
        fullWidth={showInputOnly && fullWidth}
        isLoading={showInputOnly && isLoading}
        isInvalid={isInvalid}
        autoSize={!showInputOnly}
        {...rest}
      />
    ) : null;

    const classes = classNames('euiRange', className);

    const styles = euiRangeStyles(theme);
    const cssStyles = [styles.euiRange, showInput && styles.hasInput];
    const thumbColor = levels && getLevelColor(levels, Number(value));

    const sliderScreenReaderInstructions = (
      <EuiI18n
        token="euiRange.sliderScreenReaderInstructions"
        default="You are in a custom range slider. Use the Up and Down arrow keys to change the value."
      />
    );

    const theRange = (
      <EuiRangeWrapper
        className={classes}
        css={cssStyles}
        fullWidth={fullWidth}
        compressed={compressed}
      >
        {showLabels && (
          <EuiRangeLabel side="min" disabled={disabled}>
            {min}
          </EuiRangeLabel>
        )}
        <EuiRangeTrack
          trackWidth={this.state.trackWidth}
          disabled={disabled}
          compressed={compressed}
          max={max}
          min={min}
          step={step}
          showTicks={showTicks}
          tickInterval={tickInterval}
          ticks={ticks}
          levels={levels}
          onChange={this.handleOnChange}
          value={value}
          aria-hidden={!!showInput}
          showRange={showRange}
        >
          <EuiRangeSlider
            id={showInput ? undefined : id} // Attach id only to the input if there is one
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={this.handleOnChange}
            showTicks={showTicks}
            showRange={showRange}
            tabIndex={showInput ? -1 : tabIndex}
            onMouseDown={
              showInputOnly
                ? () => (this.preventPopoverClose = true)
                : undefined
            }
            onFocus={showInput === true ? undefined : onFocus}
            onBlur={showInputOnly ? this.onInputBlur : onBlur}
            aria-hidden={!!showInput}
            thumbColor={thumbColor}
            {...rest}
            ref={this.rangeSliderRef}
          />

          {showRange && this.isValid && (
            <EuiRangeHighlight
              showTicks={showTicks}
              min={Number(min)}
              max={Number(max)}
              lowerValue={Number(min)}
              upperValue={Number(value)}
              levels={levels}
              trackWidth={this.state.trackWidth}
            />
          )}

          {showValue && !!String(value).length && (
            <EuiRangeTooltip
              value={value}
              max={max}
              min={min}
              name={name}
              showTicks={showTicks}
              valuePrepend={valuePrepend}
              valueAppend={valueAppend}
            />
          )}
        </EuiRangeTrack>
        {showLabels && (
          <EuiRangeLabel side="max" disabled={disabled}>
            {max}
          </EuiRangeLabel>
        )}
        {showInput && !showInputOnly && (
          <>
            <div
              className={
                showTicks || ticks
                  ? 'euiRange__slimHorizontalSpacer'
                  : 'euiRange__horizontalSpacer'
              }
              css={
                showTicks || ticks
                  ? styles.euiRange__slimHorizontalSpacer
                  : styles.euiRange__horizontalSpacer
              }
            />
            {theInput}
          </>
        )}
      </EuiRangeWrapper>
    );

    const thePopover = showInputOnly ? (
      <EuiInputPopover
        {...inputPopoverProps}
        className={classNames(
          'euiRange__popover',
          inputPopoverProps?.className
        )}
        input={theInput!} // `showInputOnly` confirms existence
        fullWidth={fullWidth}
        isOpen={this.state.isPopoverOpen}
        closePopover={this.closePopover}
        disableFocusTrap={true}
        popoverScreenReaderText={sliderScreenReaderInstructions}
      >
        {theRange}
      </EuiInputPopover>
    ) : undefined;

    return thePopover ? thePopover : theRange;
  }
}

export const EuiRange = withEuiTheme<EuiRangeProps>(EuiRangeClass);
