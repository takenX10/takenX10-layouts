$dir = "$PSScriptRoot/"
$ENV:CODE_TESTS_PATH="$dir/obj/test"
$ENV:CODE_TESTS_WORKSPACE="$dir/test/testFixture"
npm run compile-tests
npm run compile
npm run lint
node "$dir/obj/test/runTests"
Exit $LastExitCode
