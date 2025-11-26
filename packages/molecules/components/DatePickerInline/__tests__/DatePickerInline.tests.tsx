import { renderWithWrapper } from '../../../../testHelpers';
import { DatePickerInline } from '../index';

const onChangeMock = jest.fn();

describe('DatePickerInline', () => {
    it('renders DatePickerInline component with single mode', () => {
        const tree = renderWithWrapper(
            <DatePickerInline mode="single" date={new Date()} onChange={onChangeMock} />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders DatePickerInline component with range mode', () => {
        const tree = renderWithWrapper(
            <DatePickerInline
                mode="range"
                startDate={new Date()}
                endDate={undefined}
                onChange={onChangeMock}
            />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders DatePickerInline component with multiple mode', () => {
        const tree = renderWithWrapper(
            <DatePickerInline mode="multiple" dates={[new Date()]} onChange={onChangeMock} />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
