import { StyleSheet } from 'react-native';

import { renderWithWrapper } from '../../../../testHelpers';
import { Surface } from '../../Surface';

const styles = StyleSheet.create({
    surface: {
        width: 100,
        height: 50,
    },
});

it('should render Surface with default elevation', () => {
    const tree = renderWithWrapper(<Surface style={styles.surface}>&nbsp;</Surface>).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should render Surface with elevation level 3', () => {
    const tree = renderWithWrapper(
        <Surface style={styles.surface} elevation={3}>
            &nbsp;
        </Surface>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
