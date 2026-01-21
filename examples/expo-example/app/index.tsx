import { Switch } from 'react-native-molecules/components/Switch';
import { useState } from 'react';
import {
    Pressable,
    ScrollView,
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
import { Icon } from 'react-native-molecules/components/Icon';

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

declare module 'react-native-molecules/components/Icon' {
    interface CustomIconTypes {
        'my-custom-icons': true;
        'another-icon-set': true;
    }
}

export default function Index() {
    // const [isOn, setIsOn] = useState(false);
    // const [selectedDate, setSelectedDate] = useState(new Date());
    // const [displayedComponents, setDisplayedComponents] = useState('date');
    const [multiSelectValue, setMultiSelectValue] = useState<string[]>(['1', '2', '3']);
    // console.log('multiSelectValue', multiSelectValue);
    const [isLoading, setIsLoading] = useState(false);

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
            <ScrollView style={styles.container} contentContainerStyle={{ gap: 20 }}>
                <LoadingIndicator />
                <LoadingIndicator variant="contained" />
                <Switch />
                <TouchableRipple asChild onPress={() => console.log('Pressed')} testID="test-id">
                    <Link href="/##">Home</Link>
                </TouchableRipple>
                <Button onPress={() => console.log('Pressed')} variant="elevated" elevation={5}>
                    Home
                </Button>

                {/* New Button API Examples */}
                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
                    Button with Text compound:
                </Text>
                <Button variant="contained" onPress={() => console.log('Submit')}>
                    <Button.Text>Submit</Button.Text>
                </Button>

                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Shape variants:</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Button variant="contained" shape="rounded">
                        <Button.Text>Rounded</Button.Text>
                    </Button>
                    <Button variant="contained" shape="square" size="xs">
                        <Button.Text>Square xs</Button.Text>
                    </Button>
                    <Button variant="contained" shape="square" size="sm">
                        <Button.Text>Square sm</Button.Text>
                    </Button>
                    <Button variant="contained" shape="square" size="md">
                        <Button.Text>Square md</Button.Text>
                    </Button>
                    <Button variant="contained" shape="square" size="lg">
                        <Button.Text>Square lg</Button.Text>
                    </Button>
                    <Button variant="contained" shape="square" size="xl">
                        <Button.Text>Square xl</Button.Text>
                    </Button>
                </View>

                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Icon before text:</Text>
                <Button
                    loading={isLoading}
                    variant="contained"
                    onPress={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                            setIsLoading(false);
                        }, 5000);
                    }}>
                    <Button.Icon name="plus" type="material-community" />
                    <Button.Text>Add Item</Button.Text>
                </Button>

                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Icon after text:</Text>
                <Button variant="outlined" onPress={() => console.log('Next')}>
                    <Button.Text>Next</Button.Text>
                    <Button.Icon name="chevron-right" type="material-community" />
                </Button>

                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Icons on both sides:</Text>
                <Button variant="elevated" onPress={() => console.log('Profile')}>
                    <Button.Icon name="account" type="material-community" />
                    <Button.Text>Profile</Button.Text>
                    <Button.Icon name="chevron-right" type="material-community" />
                </Button>

                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
                    Loading state (only spinner):
                </Text>
                <Button variant="contained" disabledPress>
                    <Button.ActivityIndicator />
                    <Button.Text>Submit</Button.Text>
                </Button>
                <Button variant="contained" disabledPress>
                    <Button.ActivityIndicator />
                </Button>
                <Button variant="contained" disabled>
                    <Button.ActivityIndicator />
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
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create((theme, rt) => ({
    activityIndicator: {
        marginTop: theme.spacings['20'],
    },
    container: {
        gap: 20,
        padding: 20,
        backgroundColor: theme.colors.surface,
        height: rt.screen.height,
        _web: {},
    },
}));
