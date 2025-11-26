import {
    Text,
    View,
    Platform,
    Button,
    Switch as RNSwitch,
    ScrollView,
    TextInput,
} from 'react-native';
// import { Switch } from 'react-native-molecules/components/Switch';
import { useRef, useState } from 'react';
import { StyleSheet } from 'react-native-unistyles';
import { Select } from 'react-native-molecules/components/Select';
// import { TextInput } from 'react-native-molecules/components/TextInput';

export default function Index() {
    const [isOn, setIsOn] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [displayedComponents, setDisplayedComponents] = useState('date');
    const [multiSelectValue, setMultiSelectValue] = useState<string[]>(['1', '2', '3']);
    console.log('multiSelectValue', multiSelectValue);

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
                <Select options={singleSelectOptions}>
                    <Select.Trigger>
                        <Select.Value placeholder="Select an option" />
                    </Select.Trigger>
                    <Select.Dropdown>
                        <Select.SearchInput />
                        <Select.Content>
                            {(item, isSelected) => (
                                <Select.Option value={item.id}>{item.label}</Select.Option>
                            )}
                        </Select.Content>
                    </Select.Dropdown>
                </Select>
                <Select
                    multiple
                    options={multiSelectOptions}
                    value={multiSelectValue}
                    onChange={value => setMultiSelectValue(value as string[])}>
                    <Select.Trigger>
                        <Select.Value placeholder="Select an option" />
                    </Select.Trigger>
                    <Select.Dropdown>
                        <Select.SearchInput />
                        <Select.Content>
                            {(item, isSelected) => (
                                <Select.Option value={item.id}>{item.label}</Select.Option>
                            )}
                        </Select.Content>
                    </Select.Dropdown>
                </Select>
                <TextInput onBlur={e => {}} />
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
    },
}));
