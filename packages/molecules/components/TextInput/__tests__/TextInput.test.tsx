import { Platform } from 'react-native';

import { renderWithWrapper } from '../../../../testHelpers';
import { TextInput } from '../index';

it('renders text button by default', () => {
    const tree = renderWithWrapper(<TextInput />).toJSON();

    expect(tree).toMatchSnapshot();
});

it('renders button with flat variant', () => {
    const tree = renderWithWrapper(<TextInput variant="flat" />).toJSON();

    expect(tree).toMatchSnapshot();
});

it('renders button with outlined variant', () => {
    const tree = renderWithWrapper(<TextInput variant="outlined" />).toJSON();

    expect(tree).toMatchSnapshot();
});

it('renders button with left element', () => {
    jest.doMock('../../Icon/Icon', () => {
        return jest.fn(args => JSON.stringify(args));
    });

    const Icon = require('../../Icon/Icon');

    const { getByTestId, toJSON } = renderWithWrapper(
        <TextInput left={<Icon name="magnify" type="material-community" />} />,
    );

    expect(getByTestId('text-input-left-element')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
});

it('renders button with right element', () => {
    jest.doMock('../../Icon/Icon', () => {
        return jest.fn(args => JSON.stringify(args));
    });

    const Icon = require('../../Icon/Icon');

    const { getByTestId, toJSON } = renderWithWrapper(
        <TextInput right={<Icon name="magnify" type="material-community" />} />,
    );

    expect(getByTestId('text-input-right-element')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
});

it('correctly applies height to multiline Outline TextInput', () => {
    const { toJSON } = renderWithWrapper(
        <TextInput
            variant="outlined"
            label="Outline Input"
            placeholder="Type Something"
            value={'Some test value'}
            multiline
        />,
    );

    expect(toJSON()).toMatchSnapshot();
});

it('contains patch spacing for flat input when ios and multiline', () => {
    Platform.OS = 'ios';
    const onChangeTextMock = jest.fn();

    const { getByTestId } = renderWithWrapper(
        <TextInput
            label="Flat input"
            multiline
            placeholder="Type something"
            value={'Some test value'}
            onChangeText={onChangeTextMock}
        />,
    );

    expect(getByTestId('patch-container')).toBeTruthy();
});
