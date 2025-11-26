import { renderWithWrapper } from '../../../../testHelpers';
import { RadioButton } from '../index';
import { RadioButtonContext } from '../RadioButtonGroup';

describe('RadioButton', () => {
    describe('on default platform', () => {
        beforeAll(() => {
            jest.mock('react-native', () => {
                const RN = jest.requireActual('react-native');

                RN.Platform = () => ({
                    select: (objs: any) => objs.default,
                });

                return RN;
            });
        });

        it('renders properly', () => {
            const tree = renderWithWrapper(<RadioButton value="first" />).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });

    describe('when RadioButton is wrapped by RadioButtonContext.Provider', () => {
        it('renders properly', () => {
            const tree = renderWithWrapper(
                <RadioButtonContext.Provider value={{ value: 'first', onValueChange: () => {} }}>
                    <RadioButton value="first" />
                </RadioButtonContext.Provider>,
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });

    describe('RadioButton with custom testID', () => {
        it('renders properly', () => {
            const tree = renderWithWrapper(
                <RadioButton value="first" testID={'custom:testID'} />,
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });
});
