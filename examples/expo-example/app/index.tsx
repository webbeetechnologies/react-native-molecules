import { Switch } from 'react-native-molecules/components/Switch';
import { useState } from 'react';
import {
    Pressable,
    // Button,
    // Platform,
    // ScrollView,
    // Switch as RNSwitch,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Select } from 'react-native-molecules/components/Select';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';
import { TouchableRipple } from 'react-native-molecules/components/TouchableRipple';
import { Button } from 'react-native-molecules/components/Button';
// import { TextInput } from 'react-native-molecules/components/TextInput';
import { getWebProps } from 'react-native-unistyles/web';
import { LoadingIndicator } from 'react-native-molecules/components/LoadingIndicator';

const Link = ({ style, ...rest }) => {
    const { ref, className } = getWebProps(style);
    // console.log({ className, style });
    return (
        <a
            {...rest}
            href={rest.href}
            className={className}
            ref={ref}
            accessibilityRole="link"
            role="link"
        />
    );
};

export default function Index() {
    // const [isOn, setIsOn] = useState(false);
    // const [selectedDate, setSelectedDate] = useState(new Date());
    // const [displayedComponents, setDisplayedComponents] = useState('date');
    const [multiSelectValue, setMultiSelectValue] = useState<string[]>(['1', '2', '3']);
    // console.log('multiSelectValue', multiSelectValue);

    const singleSelectOptions = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
        { id: '3', label: 'Option 3' },
    ];

    const multiSelectOptions = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
        { id: '3', label: 'Option 3' },
        { id: '4', label: 'Option 4' },
        { id: '5', label: 'Option 5' },
        { id: '6', label: 'Option 6' },
        { id: '7', label: 'Option 7' },
        { id: '8', label: 'Option 8' },
        { id: '9', label: 'Option 9' },
        { id: '10', label: 'Option 10' },
    ];

    return (
        <>
            <View style={styles.container}>
                <LoadingIndicator />
                <LoadingIndicator variant="contained" />
                <Switch />
                <TouchableRipple asChild onPress={() => console.log('Pressed')} testID="test-id">
                    <Link href="/##">Home</Link>
                </TouchableRipple>
                <Button onPress={() => console.log('Pressed')} variant="elevated" elevation={5}>
                    Home
                </Button>
                <Select options={singleSelectOptions}>
                    <Select.Trigger>
                        <Select.Value placeholder="Select an option" />
                    </Select.Trigger>
                    <Select.Dropdown>
                        <Select.SearchInput />
                        <Select.Content>
                            {(item, _isSelected) => (
                                <Select.Option value={item.id}>{item.label}</Select.Option>
                            )}
                        </Select.Content>
                    </Select.Dropdown>
                </Select>
                <Select
                    multiple
                    hideSelected={false}
                    options={multiSelectOptions}
                    value={multiSelectValue}
                    onChange={value => setMultiSelectValue(value as string[])}>
                    <Select.Trigger>
                        <Select.Value placeholder="Select an option" />
                    </Select.Trigger>
                    <Select.Dropdown>
                        <Select.SearchInput />
                        <Select.Content>
                            {(item, _isSelected) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.label}
                                </Select.Option>
                            )}
                        </Select.Content>
                    </Select.Dropdown>
                </Select>
                <TextInput onBlur={() => {}} />
                {/* <TextInput size="sm" variant="outlined" placeholder="Enter your name" /> */}
                {/* <SelectV1
                    inputProps={{
                        variant: 'outlined',
                    }}
                    popoverProps={{
                        style: {
                            width: 200,
                        },
                    }}
                    records={[
                        {
                            data: [
                                {
                                    id: '1',
                                    label: 'Option 1',
                                },
                                {
                                    id: '2',
                                    label: 'Option 2',
                                },
                                {
                                    id: '3',
                                    label: 'Option 3',
                                },
                            ],
                        },
                    ]}
                /> */}
                <Text>Hello World</Text>
                {/* <RNSwitch value={isOn} onValueChange={setIsOn} /> */}
                {/* <Switch size={80} /> */}
                {/* <ActivityIndicator size={100} color="red" style={styles.activityIndicator} /> */}
            </View>
        </>
    );
}

const styles = StyleSheet.create(theme => ({
    activityIndicator: {
        marginTop: theme.spacings['20'],
    },
    container: {
        flex: 1,
        gap: 20,
        padding: 20,
        backgroundColor: theme.colors.surface,
        _web: {
            minHeight: '100vh',
        },
    },
}));
