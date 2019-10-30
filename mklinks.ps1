Get-ChildItem -Path .\docs\*\* -Recurse -Directory -Force -ErrorAction SilentlyContinue |
    ForEach-Object {
        $link = Join-Path -Path $_.FullName -ChildPath "slideshow.html"
        Remove-Item -Path $link -Force
        cd $_.FullName
        cmd /c "mklink slideshow.html ..\..\..\material\slideshow.html"
    }