// Import commonly used components directly
import * as React from 'react';
import { FlatList, Image, SectionList, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Accordion, AccordionItem } from 'react-native-molecules/components/Accordion';
import { ActivityIndicator } from 'react-native-molecules/components/ActivityIndicator';
import { Appbar } from 'react-native-molecules/components/Appbar';
import { Avatar } from 'react-native-molecules/components/Avatar';
import { Backdrop } from 'react-native-molecules/components/Backdrop';
import { Badge } from 'react-native-molecules/components/Badge';
import { Button, ButtonContext } from 'react-native-molecules/components/Button';
import { Card } from 'react-native-molecules/components/Card';
import { Checkbox } from 'react-native-molecules/components/Checkbox';
import { Chip } from 'react-native-molecules/components/Chip';
import { DateField } from 'react-native-molecules/components/DateField';
import {
    DatePicker,
    DatePickerContext,
    useDatePickerContext,
    useOptionalDatePickerContext,
} from 'react-native-molecules/components/DatePicker';
import { Dialog } from 'react-native-molecules/components/Dialog';
import { Divider } from 'react-native-molecules/components/Divider';
import { Drawer } from 'react-native-molecules/components/Drawer';
import { ElementGroup } from 'react-native-molecules/components/ElementGroup';
import { FAB } from 'react-native-molecules/components/FAB';
import { FilePicker, FilePickerContext } from 'react-native-molecules/components/FilePicker';
import { HelperText } from 'react-native-molecules/components/HelperText';
import { Icon } from 'react-native-molecules/components/Icon';
import { IconButton } from 'react-native-molecules/components/IconButton';
import { If } from 'react-native-molecules/components/If';
import { InputAddon } from 'react-native-molecules/components/InputAddon';
import { Link } from 'react-native-molecules/components/Link';
import { List } from 'react-native-molecules/components/List';
import { LoadingIndicator } from 'react-native-molecules/components/LoadingIndicator';
import { Menu } from 'react-native-molecules/components/Menu';
import { Modal } from 'react-native-molecules/components/Modal';
import { NavigationRail } from 'react-native-molecules/components/NavigationRail';
import { NavigationStack } from 'react-native-molecules/components/NavigationStack';
import { Popover } from 'react-native-molecules/components/Popover';
import { Portal, registerPortalContext } from 'react-native-molecules/components/Portal';
import { PortalProvider } from 'react-native-molecules/components/Portal';
import { RadioButton } from 'react-native-molecules/components/RadioButton';
import { Rating } from 'react-native-molecules/components/Rating';
import { Select } from 'react-native-molecules/components/Select';
import { Slot } from 'react-native-molecules/components/Slot';
import { StateLayer } from 'react-native-molecules/components/StateLayer';
import { Surface } from 'react-native-molecules/components/Surface';
import { Switch } from 'react-native-molecules/components/Switch';
import { Tabs } from 'react-native-molecules/components/Tabs';
import { Text } from 'react-native-molecules/components/Text';
import { TextInput, TextInputContext } from 'react-native-molecules/components/TextInput';
import { TextInputWithMask } from 'react-native-molecules/components/TextInputWithMask';
import { TimeField } from 'react-native-molecules/components/TimeField';
import {
    TimePicker,
    TimePickerContext,
    useOptionalTimePickerContext,
} from 'react-native-molecules/components/TimePicker';
import { Tooltip } from 'react-native-molecules/components/Tooltip';
import { TouchableRipple } from 'react-native-molecules/components/TouchableRipple';
import { createFastContext } from 'react-native-molecules/fast-context';
import { useHandleNumberFormat } from 'react-native-molecules/hooks';
import { ShortcutsManager } from 'react-native-molecules/shortcuts-manager';

// Create a default scope for live code examples
export const defaultScope = {
    React,
    useWindowDimensions,
    ...React,
    StyleSheet,
    View,
    Image,
    FlatList,
    SectionList,
    // Direct component imports
    registerPortalContext,
    Avatar,
    ActivityIndicator,
    Accordion,
    AccordionItem,
    Backdrop,
    Badge,
    Button,
    Checkbox,
    Text,
    Icon,
    IconButton,
    If,
    Appbar,
    Chip,
    DatePicker,
    DatePickerContext,
    useDatePickerContext,
    useOptionalDatePickerContext,
    DateField,
    Dialog,
    Drawer,
    FAB,
    HelperText,
    InputAddon,
    ListItem: List.Row,
    Menu,
    Modal,
    NavigationRail,
    NavigationStack,
    Popover,
    Portal,
    RadioButton,
    Slot,
    Surface,
    TextInputWithMask,
    TimeField,
    TimePicker,
    TimePickerContext,
    useOptionalTimePickerContext,
    TouchableRipple,
    Divider,
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
    Tooltip,
    LoadingIndicator,
    PortalProvider,
    createFastContext,
    ShortcutsManager,
    useHandleNumberFormat,
    ButtonContext,
    TextInputContext,
    FilePickerContext,
    List,
};

if ((defaultScope as any).default) {
    delete (defaultScope as any).default;
}
