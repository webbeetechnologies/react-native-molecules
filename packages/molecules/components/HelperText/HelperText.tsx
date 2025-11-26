import { memo, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent, StyleProp, TextProps, TextStyle } from 'react-native';
import { Animated } from 'react-native';

import { styles } from './utils';

export type Props = TextProps & {
    /**
     * Type of the helper text.
     */
    variant?: 'error' | 'info';
    /**
     * Whether to display the helper text.
     */
    visible?: boolean;
    /**
     * Text content of the HelperText.
     */
    children: ReactNode;
    style?: StyleProp<TextStyle>;
    /**
     * TestID used for testing purposes
     */
    testID?: string;
};

/**
 * Helper text is used in conjuction with input elements to provide additional hints for the user.
 *
 * <div class="screenshots">
 *   <img class="small" src="screenshots/helper-text.gif" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { HelperText, TextInput } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *    const onChangeText = text => setText(text);
 *
 *   const hasErrors = () => {
 *     return !text.includes('@');
 *   };
 *
 *  return (
 *     <View>
 *       <TextInput label="Email" value={text} onChangeText={onChangeText} />
 *       <HelperText variant="error" visible={hasErrors()}>
 *         Email address is invalid!
 *       </HelperText>
 *     </View>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const HelperText = ({
    style: styleProp,
    variant = 'info',
    visible = true,
    onLayout,
    maxFontSizeMultiplier = 1.5,
    ...rest
}: Props) => {
    styles.useVariants({
        variant,
    });
    const { current: shown } = useRef<Animated.Value>(new Animated.Value(visible ? 1 : 0));

    const [textHeight, setTextHeight] = useState(0);

    const { textStyle } = useMemo(() => {
        // @ts-ignore

        return {
            textStyle: [
                styles.root,
                {
                    opacity: shown,
                    transform:
                        visible && variant === 'error'
                            ? [
                                  {
                                      translateY: shown.interpolate({
                                          inputRange: [0, 1],
                                          outputRange: [-textHeight / 2, 0],
                                      }),
                                  },
                              ]
                            : [],
                },
                styleProp,
            ],
        };
    }, [shown, styleProp, textHeight, variant, visible]);

    useEffect(() => {
        if (visible) {
            // show text
            Animated.timing(shown, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        } else {
            // hide text
            Animated.timing(shown, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, shown]);

    const handleTextLayout = useCallback(
        (e: LayoutChangeEvent) => {
            onLayout?.(e);
            setTextHeight(e.nativeEvent.layout.height);
        },
        [onLayout],
    );

    return (
        <Animated.Text
            onLayout={handleTextLayout}
            style={textStyle}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
            {...rest}>
            {rest.children}
        </Animated.Text>
    );
};

export default memo(HelperText);
