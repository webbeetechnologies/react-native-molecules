import { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    type ImageErrorEventData,
    type ImageProps,
    type NativeSyntheticEvent,
    type TextProps,
    View,
    type ViewProps,
} from 'react-native';

import { tokenStylesParser } from '../../utils/tokenStylesParser';
import { Icon, type IconProps } from '../Icon';
import { Text } from '../Text';
import { avatarStyles } from './utils';

export type Props = Omit<ViewProps, 'children'> & {
    source?: ImageProps['source'];
    /**
     * Will be used as fallback if source is nullish or image doesn't load
     * */
    iconName?: IconProps['name'];
    iconType?: IconProps['type'];
    iconProps?: Omit<IconProps, 'name' | 'type' | 'ref'>;
    /**
     * Will be used as fallback if link and iconName aren't passed
     * */
    label?: string;
    labelProps?: Omit<TextProps, 'children'>;
    imageProps?: Omit<ImageProps, 'source'>;
    /**
     * Color of the Avatar
     * Will not be visible if there's an image unless the image has transparency
     * Can be color string or token
     * */
    color?: string;
    /**
     * Size of the Avatar
     * Can be a number of a token
     * */
    size?: number | string;
};

const Avatar = (
    {
        source,
        label,
        iconName,
        iconType,
        color,
        style,
        size = 32,
        iconProps,
        imageProps,
        labelProps,
        ...rest
    }: Props,
    ref: any,
) => {
    const { iconStyle, imageStyle, labelStyle } = useMemo(() => {
        return {
            imageStyle: [avatarStyles.image, imageProps?.style],
            iconStyle: [avatarStyles.icon, iconProps?.style],
            labelStyle: [avatarStyles.label, { fontSize: +size * 0.5 }, labelProps?.style],
        };
    }, [iconProps?.style, imageProps?.style, labelProps?.style, size]);

    return (
        <View
            ref={ref}
            {...rest}
            style={[
                avatarStyles.root,
                tokenStylesParser.getColor(color as string, 'backgroundColor'),
                style,
                { width: +size, height: +size },
            ]}>
            <AvatarInner
                source={source}
                imageProps={imageProps}
                iconProps={iconProps}
                iconStyle={iconStyle}
                size={+size}
                iconName={iconName}
                label={label}
                labelProps={labelProps}
                labelStyle={labelStyle}
                iconType={iconType}
                imageStyle={imageStyle}
            />
        </View>
    );
};

type AvatarInnerProps = Pick<
    Props,
    'iconName' | 'iconType' | 'iconProps' | 'imageProps' | 'labelProps' | 'label' | 'source'
> & {
    imageStyle?: ImageProps['style'];
    iconStyle?: IconProps['style'];
    labelStyle?: TextProps['style'];
    // at this point size will always be a number
    size: number;
};

const emptyObj = {};

const AvatarInner = memo(
    ({
        imageStyle,
        source,
        iconStyle,
        labelStyle,
        imageProps = emptyObj,
        iconProps,
        labelProps,
        iconName,
        iconType,
        label: labelProp,
        size,
    }: AvatarInnerProps) => {
        const [isImageFailed, setIsImageFailed] = useState(false);

        const { onError } = imageProps;

        const normalizeLabel = useMemo(() => {
            const { firstWord, secondWord } = extractFirstAndSecondWordArrays(labelProp || '');

            return `${firstWord.at(0) || ''}${secondWord.at(0) || firstWord.at(1) || ''}`;
        }, [labelProp]);

        const onImageLoadFailed = useCallback(
            (e: NativeSyntheticEvent<ImageErrorEventData>) => {
                onError?.(e);

                setIsImageFailed(true);
            },
            [onError],
        );

        useEffect(() => {
            setIsImageFailed(false);
        }, [source]);

        if (source && !isImageFailed) {
            return (
                <Image
                    {...imageProps}
                    onError={onImageLoadFailed}
                    style={imageStyle}
                    source={source}
                />
            );
        }

        if (iconName) {
            return (
                <Icon
                    name={iconName}
                    type={iconType}
                    size={size * 0.66}
                    {...iconProps}
                    style={iconStyle}
                />
            );
        }

        return (
            <Text {...labelProps} style={labelStyle}>
                {normalizeLabel}
            </Text>
        );
    },
);

// convert words into array of chars to handle words that contain surrogate pairs e.g. "👨‍👩‍👧‍👦", "🐶".
const extractFirstAndSecondWordArrays = (text: string) => {
    const [firstWord, secondWord = []] = text
        .split(' ')
        .splice(0, 2)
        .map(word => Array.from(word ?? ''));

    return {
        firstWord,
        secondWord,
    };
};

export default memo(forwardRef(Avatar));
