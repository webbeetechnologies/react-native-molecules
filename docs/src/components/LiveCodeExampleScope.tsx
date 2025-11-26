// Import commonly used components directly
import { Accordion, AccordionItem } from '@bambooapp/bamboo-molecules/components/Accordion';
import { ActivityIndicator } from '@bambooapp/bamboo-molecules/components/ActivityIndicator';
import { Appbar } from '@bambooapp/bamboo-molecules/components/Appbar';
import { Avatar } from '@bambooapp/bamboo-molecules/components/Avatar';
import { Badge } from '@bambooapp/bamboo-molecules/components/Badge';
import { Button } from '@bambooapp/bamboo-molecules/components/Button';
import { Card } from '@bambooapp/bamboo-molecules/components/Card';
import { Checkbox } from '@bambooapp/bamboo-molecules/components/Checkbox';
import { Chip } from '@bambooapp/bamboo-molecules/components/Chip';
import { DatePickerDocked } from '@bambooapp/bamboo-molecules/components/DatePickerDocked';
import { DatePickerInline } from '@bambooapp/bamboo-molecules/components/DatePickerInline';
import { DatePickerInput } from '@bambooapp/bamboo-molecules/components/DatePickerInput';
import { DatePickerModal } from '@bambooapp/bamboo-molecules/components/DatePickerModal';
import { DateTimePicker } from '@bambooapp/bamboo-molecules/components/DateTimePicker';
import { Dialog } from '@bambooapp/bamboo-molecules/components/Dialog';
import { Drawer } from '@bambooapp/bamboo-molecules/components/Drawer';
import { ElementGroup } from '@bambooapp/bamboo-molecules/components/ElementGroup';
import { FAB } from '@bambooapp/bamboo-molecules/components/FAB';
import { FilePicker } from '@bambooapp/bamboo-molecules/components/FilePicker';
import { HelperText } from '@bambooapp/bamboo-molecules/components/HelperText';
import { HorizontalDivider } from '@bambooapp/bamboo-molecules/components/HorizontalDivider';
import { Icon } from '@bambooapp/bamboo-molecules/components/Icon';
import { IconButton } from '@bambooapp/bamboo-molecules/components/IconButton';
import { Link } from '@bambooapp/bamboo-molecules/components/Link';
import { ListItem } from '@bambooapp/bamboo-molecules/components/ListItem';
import { Menu } from '@bambooapp/bamboo-molecules/components/Menu';
import { Modal } from '@bambooapp/bamboo-molecules/components/Modal';
import { NavigationRail } from '@bambooapp/bamboo-molecules/components/NavigationRail';
import { NavigationStack } from '@bambooapp/bamboo-molecules/components/NavigationStack';
import { Popover } from '@bambooapp/bamboo-molecules/components/Popover';
import { Portal, registerPortalContext } from '@bambooapp/bamboo-molecules/components/Portal';
import { PortalProvider } from '@bambooapp/bamboo-molecules/components/Portal';
import { RadioButton } from '@bambooapp/bamboo-molecules/components/RadioButton';
import { Rating } from '@bambooapp/bamboo-molecules/components/Rating';
import { Select } from '@bambooapp/bamboo-molecules/components/Select';
import { StateLayer } from '@bambooapp/bamboo-molecules/components/StateLayer';
import { Surface } from '@bambooapp/bamboo-molecules/components/Surface';
import { Switch } from '@bambooapp/bamboo-molecules/components/Switch';
import { Tabs } from '@bambooapp/bamboo-molecules/components/Tabs';
import { Text } from '@bambooapp/bamboo-molecules/components/Text';
import { TextInput } from '@bambooapp/bamboo-molecules/components/TextInput';
import { TextInputWithMask } from '@bambooapp/bamboo-molecules/components/TextInputWithMask';
import { TimePicker } from '@bambooapp/bamboo-molecules/components/TimePicker';
import { TimePickerField } from '@bambooapp/bamboo-molecules/components/TimePickerField';
import { TimePickerModal } from '@bambooapp/bamboo-molecules/components/TimePickerModal';
import { Tooltip } from '@bambooapp/bamboo-molecules/components/Tooltip';
import { TouchableRipple } from '@bambooapp/bamboo-molecules/components/TouchableRipple';
import { VerticalDivider } from '@bambooapp/bamboo-molecules/components/VerticalDivider';
import { createFastContext } from '@bambooapp/bamboo-molecules/fast-context';
import { useHandleNumberFormat } from '@bambooapp/bamboo-molecules/hooks';
import { ShortcutsManager } from '@bambooapp/bamboo-molecules/shortcuts-manager';
import * as React from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

// Create a default scope for live code examples
export const defaultScope = {
    React,
    useWindowDimensions,
    ...React,
    StyleSheet,
    View,
    Image,
    // Direct component imports
    registerPortalContext,
    Avatar,
    ActivityIndicator,
    Accordion,
    AccordionItem,
    Badge,
    Button,
    Checkbox,
    Text,
    Icon,
    IconButton,
    Appbar,
    Chip,
    DatePickerDocked,
    DatePickerInline,
    DatePickerInput,
    DatePickerModal,
    DateTimePicker,
    Dialog,
    Drawer,
    FAB,
    HelperText,
    ListItem,
    Menu,
    Modal,
    NavigationRail,
    NavigationStack,
    Popover,
    Portal,
    RadioButton,
    Surface,
    TextInputWithMask,
    TimePicker,
    TimePickerField,
    TouchableRipple,
    HorizontalDivider,
    VerticalDivider,
    Select,
    Card,
    TextInput,
    ElementGroup,
    FilePicker,
    Link,
    Rating,
    StateLayer,
    Switch,
    Tabs,
    TimePickerModal,
    Tooltip,
    PortalProvider,
    createFastContext,
    ShortcutsManager,
    useHandleNumberFormat,
};
