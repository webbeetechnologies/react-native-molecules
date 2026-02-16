import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-molecules/components/Button';
import { Checkbox } from 'react-native-molecules/components/Checkbox';
import { Chip } from 'react-native-molecules/components/Chip';
import { FAB } from 'react-native-molecules/components/FAB';
import { Icon } from 'react-native-molecules/components/Icon';
import { IconButton } from 'react-native-molecules/components/IconButton';
import { ListItem } from 'react-native-molecules/components/ListItem';
import { LoadingIndicator } from 'react-native-molecules/components/LoadingIndicator';
import { Switch } from 'react-native-molecules/components/Switch';
import { Tabs } from 'react-native-molecules/components/Tabs';
import { TextInput } from 'react-native-molecules/components/TextInput';
import { noop } from 'react-native-molecules/utils/lodash';

import styles from './styles.module.css';

// --- Animated Cell: Chips ---
const chipItems = [
    { label: 'Select', icon: 'check-circle-outline' },
    { label: 'Add photos', icon: 'camera-outline' },
    { label: 'Share album', icon: 'share-variant-outline' },
    { label: 'Search', icon: 'magnify' },
];

function ChipsCell() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedIndex(prev => (prev + 1) % chipItems.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${styles.cell} ${styles.cellChips}`}>
            <View style={rnStyles.chipsContainer}>
                {chipItems.map((chip, i) => (
                    <Chip
                        key={chip.label}
                        label={chip.label}
                        selected={i === selectedIndex}
                        variant="elevated"
                        onPress={noop}
                        left={<Icon name={i === selectedIndex ? 'check' : chip.icon} size={18} />}
                    />
                ))}
            </View>
            <View style={rnStyles.fabSpacer} />
            <FAB iconName="plus" variant="primary" size="md" />
        </div>
    );
}

// --- Animated Cell: Icon Buttons ---
const iconButtonItems = [
    { name: 'check', variant: 'contained' as const },
    { name: 'heart', variant: 'contained-tonal' as const },
    { name: 'text-box-outline', variant: 'contained-tonal' as const },
    { name: 'calendar', variant: 'contained-tonal' as const },
    { name: 'close', variant: 'contained-tonal' as const },
];

function IconButtonsCell() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % iconButtonItems.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${styles.cell} ${styles.cellIconButtons}`}>
            <View style={rnStyles.iconButtonsRow}>
                {iconButtonItems.map((item, i) => (
                    <IconButton
                        key={item.name}
                        name={item.name}
                        variant={i === activeIndex ? 'contained' : 'contained-tonal'}
                        selected={i === activeIndex}
                        size="md"
                    />
                ))}
            </View>
        </div>
    );
}

const tabs = [
    { name: 'flight', label: 'Flights', iconName: 'airplane' },
    { name: 'trips', label: 'Trips', iconName: 'bag-checked' },
    { name: 'explore', label: 'Explore', iconName: 'compass-outline' },
];

function TabsCell() {
    const [activeTab, setActiveTab] = useState<string>(tabs[0].name);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % tabs.length;
            setActiveTab(tabs[index].name);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${styles.cell} ${styles.cellSegmented}`}>
            <Tabs value={activeTab} onChange={setActiveTab}>
                {tabs.map(tab => (
                    <Tabs.Item key={tab.name} name={tab.name}>
                        <Tabs.Label label={tab.label} iconName={tab.iconName} />
                    </Tabs.Item>
                ))}
            </Tabs>
        </div>
    );
}

// --- Animated Cell: Text Inputs ---
const inputStates = ['', 'Hello', 'Hello World'];

function InputsCell() {
    const [stateIndex, setStateIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStateIndex(prev => (prev + 1) % inputStates.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${styles.cell} ${styles.cellInputs}`}>
            <View style={rnStyles.inputsContainer}>
                <TextInput
                    variant="outlined"
                    size="sm"
                    value={inputStates[stateIndex]}
                    editable={false}>
                    <TextInput.Label floatingStyle={floatingStyle}>Label</TextInput.Label>
                </TextInput>
                <TextInput
                    variant="flat"
                    size="sm"
                    value={inputStates[stateIndex]}
                    editable={false}>
                    <TextInput.Label>Label</TextInput.Label>
                </TextInput>
            </View>
        </div>
    );
}

const floatingStyle = {
    backgroundColor: 'var(--bm-color-card)',
};

// --- Animated Cell: List / Menu ---
const listItems = [
    { title: 'Add friend', icon: 'account-plus', isButton: true },
    { title: 'Friends', icon: 'heart-outline', isButton: false },
    { title: 'Alarms', icon: 'bell-outline', isButton: false },
    { title: 'Map', icon: 'map-marker-outline', isButton: false },
];

function ListCell() {
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    useEffect(() => {
        const interval = setInterval(() => {
            setHighlightedIndex(prev => {
                if (prev >= listItems.length - 1) return -1;
                return prev + 1;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${styles.cell} ${styles.cellList}`}>
            <View style={rnStyles.listContainer}>
                <View style={rnStyles.listHeader}>
                    <IconButton name="tune-variant" variant="default" size="md" />
                </View>
                {listItems.map((item, i) =>
                    item.isButton ? (
                        <View key={item.title} style={rnStyles.listButtonRow}>
                            <Button
                                variant={i === highlightedIndex ? 'contained' : 'contained-tonal'}
                                size="sm">
                                <Button.Icon name={item.icon} />
                                <Button.Text>{item.title}</Button.Text>
                            </Button>
                        </View>
                    ) : (
                        <ListItem
                            key={item.title}
                            hoverable
                            selected={i === highlightedIndex}
                            left={<Icon name={item.icon} size={20} />}>
                            <ListItem.Title>{item.title}</ListItem.Title>
                        </ListItem>
                    ),
                )}
            </View>
        </div>
    );
}

// --- Animated Cell: Bottom Toolbar ---
const toolbarIcons = ['lead-pencil', 'crop', 'tune-variant', 'cog', 'brush'];

function ToolbarCell() {
    const [activeToolIndex, setActiveToolIndex] = useState(3);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveToolIndex(prev => (prev + 1) % toolbarIcons.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${styles.cell} ${styles.cellToolbar}`}>
            <div className={styles.toolbarRow}>
                {toolbarIcons.map((icon, i) => (
                    <IconButton
                        key={icon}
                        name={icon}
                        variant={i === activeToolIndex ? 'contained' : 'default'}
                        selected={i === activeToolIndex}
                        size="md"
                    />
                ))}
            </div>
        </div>
    );
}

// --- Cell: Shapes (FAB + Switch) ---
function ShapesCell() {
    const [toggled, setToggled] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setToggled(prev => !prev);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.cellShapes}>
            <div className={styles.subCell}>
                <LoadingIndicator variant="contained" size={42} />
            </div>
            <div className={styles.subCell}>
                <View style={rnStyles.togglesRow}>
                    <Switch value={toggled} />
                    <Checkbox value={toggled} />
                </View>
            </div>
        </div>
    );
}

// --- Main Showcase ---
export default function ComponentShowcase() {
    return (
        <section className={styles.showcaseWrapper}>
            <div className={styles.grid}>
                <ChipsCell />
                <IconButtonsCell />
                <TabsCell />
                <InputsCell />
                <ListCell />
                <ToolbarCell />
                <ShapesCell />
            </div>
            <p className={styles.tagline}>
                Even the smallest elements matter. Use the new and updated expressive components to
                create more compelling user interfaces.
            </p>
        </section>
    );
}

const rnStyles = StyleSheet.create({
    chipsContainer: {
        alignItems: 'center',
        gap: 8,
    },
    fabSpacer: {
        height: 16,
    },
    iconButtonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    inputsContainer: {
        width: '100%',
        gap: 12,
        paddingHorizontal: 8,
    },
    listContainer: {
        width: '100%',
    },
    listHeader: {
        marginBottom: 8,
    },
    listButtonRow: {
        marginBottom: 12,
    },
    togglesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
});
