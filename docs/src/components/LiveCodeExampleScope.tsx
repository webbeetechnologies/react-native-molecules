// Import commonly used components directly
import * as React from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Accordion, AccordionItem } from 'react-native-molecules/components/Accordion';
import { ActivityIndicator } from 'react-native-molecules/components/ActivityIndicator';
import { Appbar } from 'react-native-molecules/components/Appbar';
import { Avatar } from 'react-native-molecules/components/Avatar';
import { Badge } from 'react-native-molecules/components/Badge';
import { Button, ButtonContext } from 'react-native-molecules/components/Button';
import { Card } from 'react-native-molecules/components/Card';
import { Checkbox } from 'react-native-molecules/components/Checkbox';
import { Chip } from 'react-native-molecules/components/Chip';
import { DatePickerDocked } from 'react-native-molecules/components/DatePickerDocked';
import { DatePickerInline } from 'react-native-molecules/components/DatePickerInline';
import { DatePickerInput } from 'react-native-molecules/components/DatePickerInput';
import { DatePickerModal } from 'react-native-molecules/components/DatePickerModal';
import { DateTimePicker } from 'react-native-molecules/components/DateTimePicker';
import { Dialog } from 'react-native-molecules/components/Dialog';
import { Drawer } from 'react-native-molecules/components/Drawer';
import { ElementGroup } from 'react-native-molecules/components/ElementGroup';
import { FAB } from 'react-native-molecules/components/FAB';
import { FilePicker } from 'react-native-molecules/components/FilePicker';
import { HelperText } from 'react-native-molecules/components/HelperText';
import { HorizontalDivider } from 'react-native-molecules/components/HorizontalDivider';
import { Icon } from 'react-native-molecules/components/Icon';
import { IconButton } from 'react-native-molecules/components/IconButton';
import { Link } from 'react-native-molecules/components/Link';
import { ListItem } from 'react-native-molecules/components/ListItem';
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
import { StateLayer } from 'react-native-molecules/components/StateLayer';
import { Surface } from 'react-native-molecules/components/Surface';
import { Switch } from 'react-native-molecules/components/Switch';
import { Tabs } from 'react-native-molecules/components/Tabs';
import { Text } from 'react-native-molecules/components/Text';
import { TextInput, TextInputContext } from 'react-native-molecules/components/TextInput';
import { TextInputWithMask } from 'react-native-molecules/components/TextInputWithMask';
import { TimePicker } from 'react-native-molecules/components/TimePicker';
import { TimePickerField } from 'react-native-molecules/components/TimePickerField';
import { TimePickerModal } from 'react-native-molecules/components/TimePickerModal';
import { Tooltip } from 'react-native-molecules/components/Tooltip';
import { TouchableRipple } from 'react-native-molecules/components/TouchableRipple';
import { VerticalDivider } from 'react-native-molecules/components/VerticalDivider';
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
    LoadingIndicator,
    PortalProvider,
    createFastContext,
    ShortcutsManager,
    useHandleNumberFormat,
    ButtonContext,
    TextInputContext,
};

if ((defaultScope as any).default) {
    delete (defaultScope as any).default;
}
