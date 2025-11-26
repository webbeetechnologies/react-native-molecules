import { useMemo } from 'react';
import { type TextStyle, View } from 'react-native';

import { format } from '../../utils/date-fns';
import type { ModeType } from '../DatePickerInline';
import { IconButton } from '../IconButton';
import { Text } from '../Text';
import type { LocalState, LocalStateMultiple, LocalStateRange, LocalStateSingle } from './types';
import { datePickerModalContentHeaderStyles } from './utils';

export interface HeaderPickProps {
    moreLabel?: string;
    label?: string;
    emptyLabel?: string;
    saveLabel?: string;
    uppercase?: boolean;
    headerSeparator?: string;
    startLabel?: string;
    endLabel?: string;
    editIcon?: string;
    calendarIcon?: string;
    closeIcon?: string;
}

export interface HeaderContentProps extends HeaderPickProps {
    state: LocalState;
    mode: ModeType;
    collapsed: boolean;
    onToggle: () => any;
    // locale: string | undefined;
    textStyle?: TextStyle;
    separatorStyle?: TextStyle;
}

function getLabel(mode: ModeType, configuredLabel?: string) {
    if (configuredLabel) {
        return configuredLabel;
    }
    if (mode === 'range') {
        return 'Select period';
    }
    if (mode === 'multiple') {
        return 'Select dates';
    }
    if (mode === 'single') {
        return 'Select date';
    }
    return '...';
}

export default function DatePickerModalContentHeader(props: HeaderContentProps) {
    const {
        onToggle,
        collapsed,
        mode,
        moreLabel,
        uppercase,
        editIcon = 'pencil',
        calendarIcon = 'calendar',
    } = props;

    const label = getLabel(props.mode, props.label);
    const allowEditing = mode !== 'multiple';

    const {
        fillContainerStyle,
        headerContentContainerStyle,
        headerStyle,
        labelStyle,
        headerTextStyle,
        separatorStyle,
        iconButtonStyle,
    } = useMemo(() => {
        const {
            fill,
            headerContentContainer,
            header,
            label: _labelStyle,
            headerText,
            headerSeparator,
            icon,
        } = datePickerModalContentHeaderStyles;

        return {
            fillContainerStyle: fill,
            headerContentContainerStyle: headerContentContainer,
            headerStyle: header,
            labelStyle: _labelStyle,
            headerTextStyle: headerText,
            separatorStyle: headerSeparator,
            iconButtonStyle: icon,
        };
    }, []);

    return (
        <View style={headerStyle}>
            <View>
                <Text style={labelStyle}>{uppercase ? label.toUpperCase() : label}</Text>
                <View style={headerContentContainerStyle}>
                    <>
                        {mode === 'range' ? (
                            <HeaderContentRange
                                {...props}
                                textStyle={headerTextStyle}
                                separatorStyle={separatorStyle}
                            />
                        ) : null}
                    </>
                    <>
                        {mode === 'single' ? (
                            <HeaderContentSingle {...props} textStyle={headerTextStyle} />
                        ) : null}
                    </>
                    <>
                        {mode === 'multiple' ? (
                            <HeaderContentMulti
                                {...props}
                                moreLabel={moreLabel}
                                textStyle={headerTextStyle}
                            />
                        ) : null}
                    </>
                </View>
            </View>
            <View style={fillContainerStyle} />
            <>
                {allowEditing ? (
                    <IconButton
                        name={collapsed ? editIcon : calendarIcon}
                        accessibilityLabel={collapsed ? 'Type in date' : 'Pick date from calendar'}
                        style={iconButtonStyle}
                        onPress={onToggle}
                    />
                ) : null}
            </>
        </View>
    );
}

// TODO add translations
export function HeaderContentSingle({
    state,
    emptyLabel = ' ',
    // locale,
    textStyle,
}: HeaderContentProps) {
    const singleState = state as LocalStateSingle;

    const label = useMemo(
        () => (singleState.date ? format(singleState.date, 'LLL dd') : emptyLabel),
        [emptyLabel, singleState.date],
    );

    return <Text style={textStyle}>{label}</Text>;
}

// TODO add translations
export function HeaderContentMulti({
    state,
    emptyLabel = ' ',
    moreLabel = 'more',
    textStyle,
}: // locale = 'en',
HeaderContentProps & { moreLabel: string | undefined }) {
    const multiState = state as LocalStateMultiple;

    const label = useMemo(() => {
        let _label = emptyLabel;
        const dateCount = multiState.dates?.length || 0;

        if (dateCount) {
            if (dateCount <= 2) {
                _label = multiState.dates!.map(date => format(date, 'LLL dd')).join(', ');
            } else {
                _label =
                    format(multiState.dates![0], 'LLL dd') + ` (+ ${dateCount - 1} ${moreLabel})`;
            }
        }
        return _label;
    }, [emptyLabel, moreLabel, multiState.dates]);

    return <Text style={textStyle}>{label}</Text>;
}

// TODO add translations
export function HeaderContentRange({
    // locale,
    state,
    headerSeparator = '-',
    startLabel = 'Start',
    endLabel = 'End',
    textStyle,
    separatorStyle,
}: HeaderContentProps) {
    const rangeState = state as LocalStateRange;

    const startDateLabel = useMemo(
        () => (rangeState.startDate ? format(rangeState.startDate, 'LLL dd') : startLabel),
        [rangeState.startDate, startLabel],
    );
    const endDateLabel = useMemo(
        () => (rangeState.endDate ? format(rangeState.endDate, 'LLL dd') : endLabel),
        [endLabel, rangeState.endDate],
    );

    return (
        <>
            <Text style={textStyle}>{startDateLabel}</Text>
            <Text style={separatorStyle}>{headerSeparator}</Text>
            <Text style={textStyle}>{endDateLabel}</Text>
        </>
    );
}
