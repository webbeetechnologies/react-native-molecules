import { renderWithWrapper } from '../../../../testHelpers';
import { FilePicker } from '../../index';

jest.doMock('../../Icon/Icon', () => {
    return jest.fn(args => JSON.stringify(args));
});

const Icon = require('../../Icon/Icon');

it('renders FilePicker with default props', () => {
    const tree = renderWithWrapper(<FilePicker right={<Icon name="upload" />} />).toJSON();

    expect(tree).toMatchSnapshot();
});

it('renders outlined FilePicker', () => {
    const tree = renderWithWrapper(
        <FilePicker variant="outlined" right={<Icon name="upload" />} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

it('renders multiple images selectable FilePicker', () => {
    const tree = renderWithWrapper(
        <FilePicker multiple type={['image/*']} right={<Icon name="upload" />} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
