import { Text } from 'react-native';

import { renderWithWrapper } from '../../../../testHelpers';
import { Button, Dialog } from '../../index';

describe('Dialog', () => {
    it('renders with content', () => {
        const tree = renderWithWrapper(
            <Dialog isOpen>
                <Dialog.Content>
                    <Text>This is content</Text>
                </Dialog.Content>
            </Dialog>,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders with title, content and 2 action buttons', () => {
        const tree = renderWithWrapper(
            <Dialog isOpen testID={'dialogTest'}>
                <Dialog.Title>Dialog Title</Dialog.Title>
                <Dialog.Content>
                    <Text>This is content</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button>Cancel</Button>
                    <Button>Save</Button>
                </Dialog.Actions>
            </Dialog>,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
