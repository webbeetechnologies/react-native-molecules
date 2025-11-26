import { type ComponentType, useCallback, useMemo } from 'react';
import { type TextProps, View, type ViewProps, type ViewStyle } from 'react-native';
import type {
    ToastHideParams,
    ToastPosition,
    ToastShowParams,
    ToastType,
} from 'react-native-toast-message/lib/src/types';

import { Button, type ButtonProps } from '../Button';
import { IconButton, type IconButtonProps } from '../IconButton';
// import { ProvideTheme } from '../../core/theme/ProvideTheme';
// import { extendTheme } from '../../core/theme/extendTheme';
import { Surface, type SurfaceProps } from '../Surface';
import { Text } from '../Text';
import { styles } from './utils';

type CustomProps = Omit<SurfaceProps, 'children'> & {
    onPressAction?: () => void;
    actionButtonLabel?: string;
    displayActionButton?: boolean;
    displayCloseButton?: boolean;

    textsContainerProps?: ViewProps;
    titleProps?: TextProps;
    descriptionProps?: TextProps;
    actionButtonProps?: Omit<ButtonProps, 'onPress' | 'children'>;
    iconButtonProps?: Partial<Omit<IconButtonProps, 'onPress'>>;
};

export type Props = {
    position?: ToastPosition;
    type?: ToastType;
    isVisible?: boolean;
    text1?: string;
    text2?: string;
    show?: (params: ToastShowParams) => void;
    hide?: (params: ToastHideParams) => void;
    props: CustomProps;
};

const MaterialToast = ({ text1, text2, hide, props = {} }: Props) => {
    const {
        displayActionButton = false,
        onPressAction,
        actionButtonLabel = 'Action',
        displayCloseButton = false,
        style,

        textsContainerProps = {},
        titleProps = {},
        descriptionProps = {},
        actionButtonProps = {},
        iconButtonProps = {},
        ...rest
    } = props;

    const onHide = useCallback(() => hide?.(), [hide]);

    const {
        containerStyle,
        textContainerStyle,
        titleStyle,
        descriptionStyle,
        actionButtonStyle,
        iconButtonStyle,
    } = useMemo(() => {
        return {
            containerStyle: [
                styles.container,
                text1 && text2 ? { minHeight: 68 } : {},
                style,
            ] as unknown as ViewStyle,
            textContainerStyle: [styles.textContainer, textsContainerProps.style],
            titleStyle: [styles.title, titleProps.style],
            descriptionStyle: [styles.description, descriptionProps.style],
            actionButtonStyle: [styles.actionButton, actionButtonProps.style],
            iconButtonStyle: [styles.iconButton, iconButtonProps.style],
        };
    }, [
        actionButtonProps.style,
        descriptionProps.style,
        iconButtonProps.style,
        style,
        text1,
        text2,
        textsContainerProps.style,
        titleProps.style,
    ]);

    return (
        <Surface style={containerStyle} elevation={3} {...rest}>
            <>
                <View {...textsContainerProps} style={textContainerStyle}>
                    <Text numberOfLines={1} ellipsizeMode="tail" {...titleProps} style={titleStyle}>
                        {text1}
                    </Text>

                    {text2 && (
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            {...descriptionProps}
                            style={descriptionStyle}>
                            {text2}
                        </Text>
                    )}
                </View>

                {displayActionButton && (
                    <Button
                        variant="text"
                        {...actionButtonProps}
                        onPress={onPressAction}
                        style={actionButtonStyle}>
                        {actionButtonLabel}
                    </Button>
                )}

                {displayCloseButton && (
                    <IconButton
                        name="close"
                        size={24}
                        onPress={onHide}
                        {...iconButtonProps}
                        style={iconButtonStyle}
                    />
                )}
            </>
        </Surface>
    );
};

// TODO - fix this component
const withInverseTheme =
    <P,>(Component: ComponentType<P>) =>
    (props: P) => {
        // const { colorMode } = useColorMode();

        // const inverseTheme = useMemo(
        //     () =>
        //         extendTheme({
        //             colorMode: colorMode === 'dark' ? 'light' : 'dark',
        //         }),
        //     [colorMode],
        // );

        // TODO - fix this component
        // @ts-expect-error
        return <Component {...props} />;
    };

export default withInverseTheme(MaterialToast);
