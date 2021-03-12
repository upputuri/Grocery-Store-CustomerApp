import {fetchCovers} from '../src/pages/home/store/coversDataActions';
import "core-js/stable";
import "regenerator-runtime/runtime";

test('thunk action creator returns a promise', () => {
    console.log(fetchCovers());
    expect(fetchCovers() instanceof Promise).toBe(true);
})