import { renderWithWrapper } from '../../../../testHelpers';
import { ListItem } from '../../index';

it('should render ListItem', () => {
    const tree = renderWithWrapper(
        <ListItem>
            <ListItem.Title>Headline</ListItem.Title>
        </ListItem>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should render ListItem with Headline text inside the ListItem.Title', () => {
    const { getByTestId } = renderWithWrapper(
        <ListItem>
            <ListItem.Title testID={'list-item-headline'}>Headline</ListItem.Title>
            <ListItem.Description>Supporting Text</ListItem.Description>
        </ListItem>,
    );
    expect(getByTestId('list-item-headline').children[0]).toEqual('Headline');
});
