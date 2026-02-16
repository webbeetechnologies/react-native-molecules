import { Switch } from 'react-native-molecules/components/Switch';
import { useContext, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Select } from 'react-native-molecules/components/Select';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';
import { TouchableRipple } from 'react-native-molecules/components/TouchableRipple';
import { Button } from 'react-native-molecules/components/Button';
import { TextInput, TextInputContext } from 'react-native-molecules/components/TextInput';
import { getWebProps } from 'react-native-unistyles/web';
import { LoadingIndicator } from 'react-native-molecules/components/LoadingIndicator';
import { Tabs } from 'react-native-molecules/components/Tabs';
import { Checkbox } from 'react-native-molecules/components/Checkbox';
import { IconButton } from 'react-native-molecules/components/IconButton';

// Example demonstrating dynamic tab addition/removal
const DynamicTabsExample = () => {
    const [tabs, setTabs] = useState([
        { name: 'tab1', label: 'Tab 1' },
        { name: 'tab2', label: 'Tab 2' },
        { name: 'tab3', label: 'Tab 3' },
    ]);
    const [activeTab, setActiveTab] = useState('tab1');

    const addTab = () => {
        const newTabNumber = tabs.length + 1;
        setTabs([...tabs, { name: `tab${newTabNumber}`, label: `Tab ${newTabNumber}` }]);
    };

    const removeTab = (tabName: string) => {
        const newTabs = tabs.filter(t => t.name !== tabName);
        if (newTabs.length > 0) {
            // If removing the active tab, switch to the first available tab
            if (activeTab === tabName) {
                setActiveTab(newTabs[0].name);
            }
            setTabs(newTabs);
        }
    };

    const removeLastTab = () => {
        if (tabs.length > 1) {
            const lastTab = tabs[tabs.length - 1];
            removeTab(lastTab.name);
        }
    };

    return (
        <View style={{ gap: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Dynamic Tabs Example:</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button variant="contained" onPress={addTab}>
                    <Button.Text>Add Tab</Button.Text>
                </Button>
                <Button variant="outlined" onPress={removeLastTab}>
                    <Button.Text>Remove Last</Button.Text>
                </Button>
            </View>
            <Tabs value={activeTab} onChange={setActiveTab} variant="primary">
                {tabs.map(tab => (
                    <Tabs.Item key={tab.name} name={tab.name}>
                        <Tabs.Label label={tab.label} />
                    </Tabs.Item>
                ))}
            </Tabs>
            <View style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
                <Text>Active: {activeTab}</Text>
                <Text>Total tabs: {tabs.length}</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                {tabs.map(tab => (
                    <Button
                        key={tab.name}
                        variant="text"
                        size="sm"
                        onPress={() => removeTab(tab.name)}>
                        <Button.Icon name="close" type="material-community" />
                        <Button.Text>{tab.label}</Button.Text>
                    </Button>
                ))}
            </View>
        </View>
    );
};
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

// Example: custom outline that is dashed when inactive and solid green when active
const DashedOutline = () => {
    const { focused, error } = useContext(TextInputContext);
    const isActive = focused;

    return (
        <TextInput.Outline
            style={{
                borderStyle: isActive ? 'solid' : 'dashed',
                ...(isActive && {
                    borderColor: 'green',
                }),
            }}
        />
    );
};
DashedOutline.displayName = 'TextInput_Outline';

const GreenLabel = () => {
    const { focused, error } = useContext(TextInputContext);
    const isActive = focused;

    return (
        <TextInput.Label style={isActive ? { color: isActive ? 'green' : undefined } : undefined}>
            Custom Border
        </TextInput.Label>
    );
};
GreenLabel.displayName = 'TextInput_Label';
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

                <IconButton
                    name="home-outline"
                    onPress={() => console.log('Pressed')}
                    variant="outlined"
                />

                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Checkbox:</Text>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Checkbox size="sm" />
                    <Checkbox size="md" />
                    <Checkbox size="lg" />
                    <Checkbox size="md" indeterminate />
                    <Checkbox size="md" disabled />
                </View>
                <Checkbox label="Checkbox with label" size="md" />

                {/* Dynamic Tabs Example - demonstrates add/remove tabs */}
                <DynamicTabsExample />

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
                    variant="contained"
                    onPress={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                            setIsLoading(false);
                        }, 5000);
                    }}>
                    {isLoading ? (
                        <Button.ActivityIndicator />
                    ) : (
                        <Button.Icon name="plus" type="material-community" />
                    )}
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
                {/* TextInput Composable API */}
                <Text style={{ fontWeight: 'bold', marginTop: 20 }}>
                    TextInput - Composable API:
                </Text>
                <TextInput variant="outlined" size="sm" placeholder="Enter your name">
                    <TextInput.Label>Name</TextInput.Label>
                </TextInput>

                <View>
                    <TextInput variant="flat" size="sm" placeholder="Enter your email">
                        <TextInput.Label>Email</TextInput.Label>
                        <TextInput.SupportingText>
                            We'll never share your email
                        </TextInput.SupportingText>
                    </TextInput>
                </View>

                <Text style={{ fontWeight: 'bold', marginTop: 20 }}>TextInput - With Icons:</Text>
                <TextInput variant="outlined" size="sm" placeholder="Enter username">
                    <TextInput.Left>
                        <TextInput.Icon name="account" type="material-community" />
                    </TextInput.Left>
                    <TextInput.Label>Username</TextInput.Label>
                </TextInput>

                <View>
                    <TextInput variant="outlined" size="sm" error placeholder="Enter email">
                        <TextInput.Left>
                            <TextInput.Icon name="email" type="material-community" />
                        </TextInput.Left>
                        <TextInput.Label>Email</TextInput.Label>
                        <TextInput.Right>
                            <TextInput.Icon name="alert-circle" type="material-community" />
                        </TextInput.Right>
                        <TextInput.SupportingText>Invalid email format</TextInput.SupportingText>
                    </TextInput>
                </View>

                <TextInput variant="flat" size="sm" placeholder="Enter password">
                    <TextInput.Label>Password</TextInput.Label>
                    <TextInput.Right>
                        <TextInput.Icon name="eye" type="material-community" />
                    </TextInput.Right>
                </TextInput>

                <Text style={{ fontWeight: 'bold', marginTop: 20 }}>
                    TextInput - Custom Outline (Dashed → Solid Green):
                </Text>
                <TextInput
                    variant="outlined"
                    size="sm"
                    placeholder="Type to see solid green border">
                    <GreenLabel />
                    <DashedOutline />
                </TextInput>
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
